# -*- coding: utf-8 -*-

from flask import Flask, request, redirect, make_response, render_template
from flask.json import jsonify
import json
from collections import defaultdict
app = Flask(__name__)

relation_store = defaultdict(set)
relation_store[1000001] = {1000002}
relation_store[1000002] = {1000001, 1000003}
relation_store[1000003] = {1000002}

node_store = {
    1000003: {
        'data': {
            'title': 'Emphasis',
            'content': '''Emphasis, aka italics, with *asterisks* or _underscores_.
            Strong emphasis, aka bold, with **asterisks** or __underscores__.
            Combined emphasis with **asterisks and _underscores_**.
            Strikethrough uses two tildes. ~~Scratch this.~~'''
        }
    },
    1000002: {
        'data': {
            'title': 'Alternative Headers',
            'content': '''Alternatively, for H1 and H2, an underline-ish style:

Alt-H1
======

Alt-H2
------'''
        }
    },
    1000001: {
        'data': {
            'title': 'Headers',
            'content': '''# H1
## H2
### H3
#### H4
##### H5
###### H6'''
        }
    }
}

@app.route('/api/nodes', methods=['GET', 'POST'])
def notes():
    """
    GET: get users' node list (by create_time default).
    POST: create a node.
    """
    if request.method == 'GET':
        data = []
        for id, resource in node_store.items():
            item = dict(resource)
            item['id'] = id
            data.append(item)
        return make_response(json.dumps(data))
    elif request.method == 'POST':
        id = max(node_store.keys()) + 1
        data = request.get_json(force=True)
        node_store[id] = {
            'data': {
                'title': data['title'],
                'content': data['content']
            }
        }
        return redirect('/api/node/%s' % id)

@app.route('/api/nodes/<int:id>', methods=['GET', 'POST', 'PUT', 'DELETE'])
def api_node(id):
    """
    GET: get node resource
    POST: create a node, default related with current node.
    PUT: modify node.
    DELETE: delete node, and all relations with it.
    """
    if request.method == 'GET':
        item = dict(node_store[id])
        item['id'] = id
        return jsonify(**item)
    elif request.method == 'POST':
        new_id = max(node_store.keys()) + 1
        data = request.get_json(force=True)
        relation_store[id].add(new_id)
        relation_store[new_id].add(id)
        node_store[new_id] = {
            'data': {
                'title': data['title'],
                'content': data['content'],
            }
        }
        return redirect('/api/node/%s' % new_id)
    elif request.method == 'PUT':
        data = request.get_json(force=True)
        node_store[id]['data']['title'] = data['title']
        node_store[id]['data']['content'] = data['content']
        item = dict(node_store[id])
        item['id'] = id
        return jsonify(**item)
    elif request.method == 'DELETE':
        relation_store.remove(id)
        for key in relation_store:
            relation_store[key].remove(id)
        del node_store[id]
        return jsonify({}), 201


@app.route('/api/nodes/<int:id>/cascades', methods=['GET'])
def api_node_cascades(id):
    """
    GET nodes related with current node.
    """
    if request.method == 'GET':
        without = {int(i) for i in request.args.get('without', '').split()}
        ids = [i for i in relation_store[id] if i not in without]
        data = []
        for id in ids:
            item = dict(node_store[id])
            item['id'] = id
            data.append(item)
        return make_response(json.dumps(data))

@app.route('/api/nodes/<int:id>/cascades/<int:other>', methods=['DELETE'])
def api_node_cascade(id, other):
    relation_store[id].remove(other)
    relation_store[other].remove(id)
    return jsonify({}), 201

@app.route('/')
def webapp():
    return render_template('index.html')

if __name__ == '__main__':
    app.run(use_debugger=True, use_reloader=True)
