var grafo
var vertices = [], aristas = []
var nodes, edges
var network
var entrado = false
//const {ipcRenderer} = require("electron");

const {ipcRenderer} = require("electron");

function createNewNodeWindow(){
  ipcRenderer.send("createWindow", "newNodo");
}

function createRemoveNodeWindow(){
  ipcRenderer.send("createWindow", "removeNodo")
}

function askGrafo() {
  ipcRenderer.send("dameGrafoVisual", "newNodo");
}

function reqDFS() {
  ipcRenderer.send("DFS", "")
}

function reqBFS() {
  ipcRenderer.send("BFS", "")
}

function reqPCE() {
  ipcRenderer.send("PCE", "")
}

ipcRenderer.on("marcarPCE", function(event, arg) {
  console.log("asdasds");
  camino = arg
  var newColor = '#FF0000'
  var i = 0, howManyTimes = camino.length;
  function f() {
      try{
        edges.update({id: camino[i].arista, color: newColor})
        edges.update({id: camino[i].arista[2]+camino[i].arista[1]+camino[i].arista[0], color: newColor})
      }catch(err){
          console.log(err);

      }


      i++;
      if( i < howManyTimes ){
          setTimeout( f, 1000 );
      }
  }
  f();
})

ipcRenderer.on("marcarDFS", function(event, arg) {
  arbol = arg
  var newColor = '#FF0000'
  var i = 0, howManyTimes = arbol.vertices.length, j=0;
  function f() {
    for (j = 0; j < arbol.vertices[i].aristas.length; j++) {
      edges.update({id: arbol.vertices[i].label+"-"+arbol.vertices[i].aristas[j], color: newColor})
    }
    nodes.update({id: arbol.vertices[i].label, color:{background: newColor}})
    nodes.update({id: arbol.vertices[i].aristas[0], color:{background: newColor}})
      i++;
      if( i < howManyTimes ){
          setTimeout( f, 2000 );
      }
  }
  f();
})

ipcRenderer.on("marcarBFS", function(event, arg) {

  arbol = arg
  var newColor = '#FF0000'
  var i = 0, howManyTimes = arbol.vertices.length;
  function f() {
    for (var j = 0; j < arbol.vertices[i].aristas.length; j++) {
      edges.update({id: arbol.vertices[i].label+"-"+arbol.vertices[i].aristas[j], color: newColor})
    }
    nodes.update({id: arbol.vertices[i].label, color:{background: newColor}})
      i++;
      if( i < howManyTimes ){
          setTimeout( f, 2000 );
      }
  }
  f();
})

ipcRenderer.on("rip", function(event, arg) {
  if(arg == "expansion"){
    alert("Grafo sin árbol de expansión")
  }
})

ipcRenderer.on("deleteNodo", function(event, arg) {
  nodes.remove({id: arg})
})

ipcRenderer.on("addNodo", function(event, arg) {
  nodes.add({id: arg, label: arg})
})

ipcRenderer.on("tomaGrafoVisual", function(event, arg) {
  if(network){
    network.destroy()
    network = null
  }
  entrado = true
  console.log(arg);
  grafo = arg

  prepareGraph()

  nodes = new vis.DataSet(vertices);
  // create an array with edges
  edges = new vis.DataSet(aristas);
  // create a network
  var container = document.getElementById('graph');
  var data = {
    nodes: nodes,
    edges: edges
  };
  var options = {};
  network = new vis.Network(container, data, options);

})

ipcRenderer.on("updateGrafo", function(event, arg) {
  grafo = arg
  prepareGraph()
})

function prepareGraph() {
  for (var i = 0; i < grafo.vertices.length; i++) {
    vertices.push({id: grafo.vertices[i].label, label: grafo.vertices[i].label})
    for (var j = 0; j < grafo.vertices[i].aristas.length; j++) {
      if(!aristaPresente(grafo.vertices[i].aristas[j].destino+"-"+grafo.vertices[i].label))
        aristas.push({id: grafo.vertices[i].label+"-"+grafo.vertices[i].aristas[j].destino,from: grafo.vertices[i].label, to: grafo.vertices[i].aristas[j].destino})
    }
  }
}

function aristaPresente(id) {
  for (var i = 0; i < aristas.length; i++) {
    if(aristas[i].id == id){
      return true
    }
  }
  return false
}

function kruskal(grafo) {

}
