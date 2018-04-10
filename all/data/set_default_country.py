import sys
from elasticsearch import Elasticsearch

DEV_HOST = 'vilsardana.vpc.dev.scl1.us.tribalfusion.net'
PROD_HOST = 'viedge-analytics-es-01.vpc.prod.scl1.us.tribalfusion.net'
PORT = 9200
PRODUCT_INDEX = 'product'
PRODUCT_DOC_TYPE = 'product'

if len(sys.argv) > 1 and sys.argv[1] == "prod":
    print "Using PROD:", PROD_HOST
    HOST = PROD_HOST
else:
    print "Using DEV:", DEV_HOST
    HOST = DEV_HOST

ES = Elasticsearch(
    hosts=[{'host': HOST, 'port': PORT}]
)

def get_index(record):
    return record["_id"]

def update_country_field(ids):
    print "Updating records..."
    body = []
    for id in ids :
        body.append({"update": {"_index": PRODUCT_INDEX, "_type": PRODUCT_DOC_TYPE, "_id": id}})
        body.append({"doc": {"country": "US"}})
    res = ES.bulk(body=body)
    print "Total records: ", len(res["items"])
    if res["errors"]:
        error_items = [item for item in res["items"] if item["update"]["status"] != 200]
        print "Successfully updated:", (len(res["items"]) - len(error_items))
        print "Failed:", len(error_items)
        for item in error_items:
            print "id:", item["update"]["_id"], "," , "error:", item["update"]["error"]
    else:
        print "No Errors"

result = ES.search(index=PRODUCT_INDEX, doc_type=PRODUCT_DOC_TYPE, size=100000)
result = result["hits"]["hits"]
result = [p for p in result if not p["fields"].has_key("country")]

product_ids = map(get_index, result)

if len(product_ids) > 0 :
    print len(product_ids), "records need to be updated"
    update_country_field(product_ids)
else :
    print "No records to update"
