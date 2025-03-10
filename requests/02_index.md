# 02 index

## インデックスマッピング設定

```http
PUT {{host}}/articles
Content-Type: application/json
Authorization: Basic {{user}}:{{password}}

{
  "settings": {
    "index.number_of_shards": 1,
    "analysis": {
      "char_filter": {
        "normalize": {
          "type": "icu_normalizer",
          "name": "nfkc",
          "mode": "compose"
        }
      },
      "analyzer": {
        "kuromoji_analyzer": {
          "type": "custom",
          "char_filter": [
            "normalize"
          ],
          "tokenizer": "kuromoji_tokenizer",
          "filter": [
            "kuromoji_readingform"
          ]
        }
      }
    }
  },
  "mappings": {
    "properties": {
      "title": {
        "type": "text",
        "analyzer": "kuromoji_analyzer",
        "search_analyzer": "kuromoji_analyzer"
      },
      "summary": {
        "type": "text"
      },
      "link": {
        "type": "keyword"
      },
      "author": {
        "type": "text"
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
      "title": "引っ越し"
    }
  }
}
```

## インデックス削除

```http

@index_name = articles

DELETE {{host}}/{{index_name}}
Content-Type: application/json
Authorization: Basic {{user}}:{{password}}
```