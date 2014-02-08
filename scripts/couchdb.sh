#!/bin/bash
# Please make sure that you use correct hosts
curl -X PUT http://127.0.0.1:5984/users
curl -X PUT http://127.0.0.1:5984/users/_design/info/ -d '{"language":"javascript","views":{"full":{"map":"function(doc) {emit(doc.firstName, doc);}"}}}'
curl -X PUT http://localhost:3000/generate-users
