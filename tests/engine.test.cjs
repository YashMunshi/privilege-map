'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),E=require('../web/engine.js');
const copy=()=>structuredClone(E.initial);

test('Nested memberships reach payroll',()=>{const r=E.run(copy());assert.equal(r.metrics.beforePaths,1);assert.deepEqual(r.graph.paths[0].edges,['e1','e2','e3','e4','e5']);});
test('Removing an assumption edge breaks the route',()=>{const x=copy();x.removeEdges=['e3'];assert.equal(E.run(x).metrics.afterPaths,0);});
test('Cycles do not repeat nodes or loop forever',()=>{const x=copy();for(const p of E.run(x).graph.paths)assert.equal(new Set(p.nodes).size,p.nodes.length);});
test('Unknown endpoints and duplicate edges are rejected',()=>{const x=copy();x.edges[0].to='missing';assert.throws(()=>E.run(x),/endpoint/);const y=copy();y.edges.push({...y.edges[0]});assert.throws(()=>E.run(y),/unique/);});
test('Removing one route preserves an alternate route',()=>{const x=copy();x.edges.push({id:'direct',from:'alice',to:'admin-role',relation:'direct grant'});x.removeEdges=['e3'];const r=E.run(x);assert.equal(r.metrics.beforePaths,2);assert.equal(r.metrics.afterPaths,1);});
test('No graph mutation leaks between runs',()=>{const x=copy(),before=JSON.stringify(x);E.run(x);assert.equal(JSON.stringify(x),before);});
