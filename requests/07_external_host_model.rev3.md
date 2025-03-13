# external host model rev3

## クラスタ設定

### クラスタ設定の確認

```http
GET {{host}}/_cluster/settings
Content-Type: application/json
Authorization: Basic {{user}}:{{password}}
```

### クラスタ設定変更

```http
PUT {{host}}/_cluster/settings
Content-Type: application/json
Authorization: Basic {{user}}:{{password}}

{
  "persistent": {
    "plugins": {
      "ml_commons": {
        "trusted_connector_endpoints_regex": ["^https?://host.docker.internal:8000/.*$"],
        "model_auto_deploy.enable": "true",
        "connector.private_ip_enabled": "true"
      }
    }
  }
}
```

## モデル

### モデルグループ一覧取得

```http
GET {{host}}/_plugins/_ml/model_groups/_search
Content-Type: application/json
Authorization: Basic {{user}}:{{password}}

{
  "query": {
    "match_all": {}
  }
}
```

### モデルグループ登録

```http
POST {{host}}/_plugins/_ml/model_groups/_register
Content-Type: application/json
Authorization: Basic {{user}}:{{password}}

{
  "name": "remote_model_group",
  "description": "external hosted model group"
}
```

## コネクタ作成

### コネクタ一覧

```http
GET {{host}}/_plugins/_ml/connectors/_search
Content-Type: application/json
Authorization: Basic {{user}}:{{password}}

{
  "query": {
    "match_all": {}
  }
}
```

### コネクタ作る

```http
POST {{host}}/_plugins/_ml/connectors/_create
Content-Type: application/json
Authorization: Basic {{user}}:{{password}}

{
  "name": "localhost hosted embeddings model server connector",
  "description": "ローカルでホストしているembeddingsモデルサーバに接続するためのコネクタ",
  "version": 1,
  "protocol": "http",
  "parameters": {
    "endpoint": "host.docker.internal:8000"
  },
  "credential": {
    "type": "none"
  },
  "actions": [
    {
      "action_type": "predict",
      "method": "POST",
      "url": "http://${parameters.endpoint}/encode",
      "headers": {
        "Content-Type": "application/json"
      },
      "request_body": "{ \"text\": \"${parameters.text}\" }",
      "pre_process_function": "\n return '{' + '\"parameters\":' + '{' + '\"text\":\"' +  params.text_docs[0] + '\"}' + '}' ",
      "post_process_function": "connector.post_process.default.embedding"
    }
  ]
}
```

## モデル作成

### モデル一覧

```http
GET {{host}}/_plugins/_ml/models/_search
Content-Type: application/json
Authorization: Basic {{user}}:{{password}}

{
  "query": {
    "match_all": {}
  }
}
```

### モデル作る

```http
POST {{host}}/_plugins/_ml/models/_register
Content-Type: application/json
Authorization: Basic {{user}}:{{password}}

{
  "name": "multilingual-e5-large",
  "function_name": "remote",
  "model_group_id": "Xiy_ipUBNSyaBarovVSi",
  "description": "localhostのembeddingモデルAPI",
  "connector_id": "gSzbipUBNSyaBaro7lTi"
}
```

### モデルをデプロイする

```http
POST {{host}}/_plugins/_ml/models/gyzcipUBNSyaBaroHlTJ/_deploy
Content-Type: application/json
Authorization: Basic {{user}}:{{password}}
```

### モデルテスト

```http
POST {{host}}/_plugins/_ml/models/gyzcipUBNSyaBaroHlTJ/_predict
Content-Type: application/json
Authorization: Basic {{user}}:{{password}}

{
  "parameters": {
    "text": "大胆で見え透いた強がりも まあいいよ"
  }
}
```

## 取り込みパイプライン

### パイプライン削除

```http
DELETE {{host}}/_ingest/pipeline/nlp-spotify-playlist-ingest-pipeline-lg1
Content-Type: application/json
Authorization: Basic {{user}}:{{password}}
```

### パイプライン作成

```http
PUT {{host}}/_ingest/pipeline/nlp-spotify-playlist-ingest-pipeline-lg1
Content-Type: application/json
Authorization: Basic {{user}}:{{password}}

{
  "description": "embedding APIに接続するためのパイプライン",
  "processors": [
    {
      "text_embedding": {
        "model_id": "gyzcipUBNSyaBaroHlTJ",
        "field_map": {
          "name.text": "embeddings"
        },
        "batch_size": 5
      }
    },
    {
      "text_embedding": {
        "model_id": "gyzcipUBNSyaBaroHlTJ",
        "field_map": {
          "album.name.text": "embeddings"
        },
        "batch_size": 5
      }
    },
    {
      "text_embedding": {
        "model_id": "gyzcipUBNSyaBaroHlTJ",
        "field_map": {
          "artists.name.text": "embeddings"
        },
        "batch_size": 5
      }
    }
  ]
}
```

## インデックス

### インデックス消す

```http
DELETE {{host}}/spotify-playlist-nlp-lg1
Content-Type: application/json
Authorization: Basic {{user}}:{{password}}
```

### インデックス作る

```http
PUT {{host}}/spotify-playlist-nlp-lg1
Content-Type: application/json
Authorization: Basic {{user}}:{{password}}

{
  "settings": {
    "index": {
      "number_of_shards": 1,
      "knn": true,
      "knn.algo_param.ef_search": 100
    },
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
      "track_id": {
        "type": "keyword"
      },
      "name": {
        "properties": {
          "text": {
            "type": "text",
            "analyzer": "kuromoji_analyzer",
            "search_analyzer": "kuromoji_analyzer"
          },
          "embeddings": {
            "type": "knn_vector",
            "dimension": 1024,
            "method": {
              "engine": "nmslib",
              "space_type": "l2",
              "name": "hnsw",
              "parameters": {
                "ef_construction": 128,
                "m": 24
              }
            }
          }
        }
      },
      "album": {
        "properties": {
          "name": {
            "properties": {
              "text": {
                "type": "text",
                "analyzer": "kuromoji_analyzer",
                "search_analyzer": "kuromoji_analyzer"
              },
              "embeddings": {
                "type": "knn_vector",
                "dimension": 1024,
                "method": {
                  "engine": "nmslib",
                  "space_type": "l2",
                  "name": "hnsw",
                  "parameters": {
                    "ef_construction": 128,
                    "m": 24
                  }
                }
              }
            }
          }
        }
      },
      "artists": {
        "type": "nested",
        "properties": {
          "name": {
            "properties": {
              "text": {
                "type": "text",
                "analyzer": "kuromoji_analyzer",
                "search_analyzer": "kuromoji_analyzer"
              },
              "embeddings": {
                "type": "knn_vector",
                "dimension": 1024,
                "method": {
                  "engine": "nmslib",
                  "space_type": "l2",
                  "name": "hnsw",
                  "parameters": {
                    "ef_construction": 128,
                    "m": 24
                  }
                }
              }
            }
          }
        }
      }
    }
  }
}
```

### インデックスにドキュメント入れる

```http
POST {{host}}/_bulk?batch_size=5&pipeline=nlp-spotify-playlist-ingest-pipeline-lg1
Content-Type: application/x-ndjson
Authorization: Basic {{user}}:{{password}}

{ "create": { "_index": "spotify-playlist-nlp-lg1", "_id": "TRACK-0001" } }
{ "track_id": "07IDjll9GzDoaON2h9SmiD", "name": { "text": "すみれ September Love(2006リマスタリング)" }, "album": { "name": { "text": "RADIO FANTASY +4" } }, "artists": [ { "name": { "text": "Ippu-Do" } } ] }
```

### インデックスを全検索する

```http
GET {{host}}/spotify-playlist-nlp-lg1/_search
Content-Type: application/json
Authorization: Basic {{user}}:{{password}}

{
  "_source": {
    "exclude": "embeddings"
  },
  "query": {
    "match_all": {}
  }
}
```

## 検索

### 検索パイプライン作る

```http
PUT {{host}}/_search/pipeline/nlp-spotify-playlist-search-pipeline-lg1
Content-Type: application/json
Authorization: Basic {{user}}:{{password}}

{
  "description": "検索パイプライン",
  "phase_results_processors": [
    {
      "normalization-processor": {
        "normalization": {
          "technique": "min_max"
        },
        "combination": {
          "technique": "arithmetic_mean",
          "parameters": {
            "weights": [0.7, 0.3]
          }
        }
      }
    }
  ]
}
```

### ハイブリッド検索する

```http
@word = macos

GET {{host}}/spotify-playlist-nlp-lg1/_search?search_pipeline=nlp-spotify-playlist-ingest-pipeline-lg1
Content-Type: application/json
Authorization: Basic {{user}}:{{password}}

{
  "_source": {
    "exclude": ["embeddings"]
  },
  "query": {
    "hybrid": {
      "queries": [
        {
          "match": {
            "text": {
              "query": "{{word}}"
            }
          }
        },
        {
          "neural": {
            "embeddings": {
              "query_text": "{{word}}",
              "model_id": "gyzcipUBNSyaBaroHlTJ",
              "k": 5
            }
          }
        }
      ]
    }
  }
}
```