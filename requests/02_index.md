# 02 index

## インデックスマッピング設定

```http
PUT {{host}}/articles
Content-Type: application/json
Authorization: Basic {{user}}:{{password}}

{
  "settings": {
    "index.number_of_shards": 1
  },
  "mappings": {
    "properties": {
      "title": {
        "type": "text"
      },
      "summary": {
        "type": "text"
      },
      "path": {
        "type": "keyword"
      }
    }
  }
}
```

## ドキュメント追加

```http
POST {{host}}/_bulk
Content-Type: application/x-ndjson
Authorization: Basic {{user}}:{{password}}

{ "create": { "_index": "articles", "_id": "WK-001" } }
{ "title": "sample1", "summary": "sample summary 1", "path": "to" }
```

## 検索

```http

@index_name = articles

GET {{host}}/{{index_name}}/_search
Content-Type: application/json
Authorization: Basic {{user}}:{{password}}

{
  "query": {
    "match": {
      "summary": "sample"
    }
  }
}
```