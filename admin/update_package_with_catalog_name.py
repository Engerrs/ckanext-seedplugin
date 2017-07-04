import ckan.logic as logic
import ckan.model as model
import requests
from sqlalchemy import create_engine
from ConfigParser import ConfigParser
from argparse import ArgumentParser
import json
from dateutil.parser import parse

ValidationError = logic.ValidationError

config = ConfigParser()
parser = ArgumentParser()
parser.add_argument(
    '-c', '--config', help='Config file',
    type=lambda name: config.read([name]), required=True
)

parser.add_argument(
    '-k', '--key', help='Api Key', required=True
)
args = parser.parse_args()
engine = create_engine(config.get('app:main', 'sqlalchemy.url'))
model.init_model(engine)

HOST = config.get('app:main', 'ckan.site_url')
API_KEY = args.key

datasets = requests.get(
    HOST + '/api/3/action/package_search?fq=&rows=1000',
    verify=False,
    headers={
        'Authorization': API_KEY,
        'Content-type': 'application/json'
    }).json()

print("{0} datasets found".format(datasets['result']['count']))

for idx, data in enumerate(datasets['result']['results']):
    if 'last_modified' in data:
        try:
            data['last_modified'] = parse(data['last_modified']).strftime('%Y-%m-%d')
        except:
            if 'created' in data:
                data['last_modified'] = data['created']
            elif 'metadata_modified' in data:
                data['last_modified'] = data['metadata_modified']
            else:
                data['last_modified'] = data['metadata_created']
            data['last_modified'] = parse(data['last_modified']).strftime('%Y-%m-%d')

    if 'resources' in data:
        for resource in data['resources']:
            if ('last_modified' in resource and (
                    resource['last_modified'] is None or resource['last_modified'] == 'N/A')):
                resource['last_modified'] = resource['created']

            resource['last_modified'] = parse(resource['last_modified']).strftime('%Y-%m-%d')

    if 'extras' in data:
        new_extras = []
        print("Analyzing {0}...".format(data['extras']))
        for extra in data['extras']:
            if 'key' in extra and 'value' in extra and extra['key'] == 'layer_id':
                print("Adding layer list name: {0}".format(extra['value']))
                data['layer_list_name'] = extra['value']
            else:
                new_extras.append(extra)
        data['extras'] = new_extras

    if 'layer_catalog_name' not in data:
        data['layer_catalog_name'] = 'SEED_catalog'

    try:
        print("{0}. Updating dataset {1}.".format(idx, data['name']))
        r = requests.post(
            HOST + '/api/3/action/package_update',
            verify=False,
            data=json.dumps(data),
            headers={
                'Authorization': API_KEY,
                'Content-type': 'application/json'
            }).json()
        if r['success']:
            print("{0}. Dataset: {1} has been updated.".format(idx, data['name']))
        else:
            print("{0}. Dataset: {1} is not updated. Response was: {2}".format(idx, data['name'], r))
    except Exception as e:
            print type(e), e
