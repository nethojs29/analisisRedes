const electron = require('electron')
// Module to control application life.
const app = electron.app
// Module to create native browser window.
const BrowserWindow = electron.BrowserWindow

const ipcMain = electron.ipcMain

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow
let dialog
let graph
let mainPage

ipcMain.on("createWindow", function(event,arg){
  mainPage = event.sender
  if(arg == "newNodo"){
    createNewNodeWindow()
  }else if(arg == "removeNodo"){
    createRemoveNodeWindow()
  }
})

ipcMain.on("dameGrafo", function(event, arg){
  reg = event.sender
  reg.send("tomaGrafo",graph)
})

ipcMain.on("dameGrafoVisual", function(event, arg){
  reg = event.sender
  reg.send("tomaGrafoVisual",graph)
})

ipcMain.on("newNodo", function (event, arg) {
  agregarNodo(graph, arg);
  dialog.close()
  mainPage.send("addNodo", arg)
  printGrafo()
});

ipcMain.on("deleteNode", function(event, arg){
  eliminarNodo(graph, arg);
  dialog.close()
  mainPage.send("deleteNodo", arg)
  printGrafo()
})

ipcMain.on("PCE", function(event, arg) {
  tienePaseoCerradoEuler(graph, event.sender)
})

ipcMain.on("DFS", function(event, arg) {
  DFS(graph,event.sender)
})

ipcMain.on("BFS", function(event, arg) {
  BFS(graph, event.sender)
})

function createWindow () {
  // Create the browser window.
  mainWindow = new BrowserWindow({width: 800, height: 600, show: true})

  // and load the index.html of the app.
  mainWindow.loadURL(`file://${__dirname}/ui/index.html`)

  // Open the DevTools.
  mainWindow.webContents.openDevTools()

  // Emitted when the window is closed.
  mainWindow.on('closed', function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null
  })
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', function () {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow()
  }
})



// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.


function createNewNodeWindow(){
  dialog = new BrowserWindow({width: 400,height:300, show: true});
  dialog.loadURL(`file://${__dirname}/ui/newNode.html`)
}

function createRemoveNodeWindow(){
  dialog = new BrowserWindow({width: 400,height:300, show: true});
  dialog.webContents.openDevTools()
  dialog.loadURL(`file://${__dirname}/ui/removeNode.html`)
}

function createRemoveEdgeWindow(){
  dialog = new BrowserWindow({width: 400,height:300, show: true});
  dialog.loadURL(`file://${__dirname}/ui/removeEdge.html`)
}

function init(){

  console.log("\n");

}

function esBipartito(grafo){
  grafo.vertices[0].conjunto = "c1"
  for (var i = 0; i < grafo.vertices.length; i++) {
    if (!marcarVecinos(grafo.vertices[i],grafo.vertices[i].conjunto)){
      return "Grafo no Bipartito"

    }
  }
  return "Grafo Bipartito"

}

function marcarVecinos(grafo, vertice, conjunto){
  //console.log(conjunto);
  var conj = conjunto == "c1" ? "c2" : "c1"
  if (conjunto != "c1" && conjunto != "c2") conj = "c1"
  //console.log(conj);
  for (var i = 0; i < vertice.aristas.length; i++) {
    var v = grafo.vertices[indiceDeNodo(grafo,vertice.aristas[i])]
    if(v.conjunto == conjunto && conjunto != ""){
      console.log("rip con" + vertice.conjunto + " - "+v.conjunto);
      return false
    }else{
      v.conjunto = conj
    }
  }
  return true
}

function tienePaseoCerradoEuler(grafo, dude) {
  for (var i = 0; i < grafo.vertices.length; i++) {
    if(grafo.vertices[i].grado % 2 == 1){
      console.log("Grafo sin paseo cerrado de Euler");
      return
    }
  }
  var pila = []
  var cola = []
  var camino = []
  var vertice = grafo.vertices[getRandom(0,grafo.vertices.length-1)]
  var verticePila = vertice
  var verticeCola = vertice
  var aristaE
  var turno = "p"

  //pila.push(vertice)
  //cola.push(vertice)

  do{
    console.log(turno);
    if (turno == "p") {
        var x = getRandom(0,verticePila.aristas.length-1)
        for (var i = 0; i < verticePila.aristas.length; i++) {
          var v = grafo.vertices[indiceDeNodo(grafo, verticePila.aristas[x])]
          if (v.grado > 1){
            //console.log("apilando "+v.label+"-"+verticePila.label);
            pila.push({"arista":v.label+"-"+verticePila.label})
            //console.log(cola);
            //console.log(pila);
            eliminarArista(grafo,verticePila.label, v.label)
            verticePila = v
            turno = "c"
            break
          }else turno = "c"
          if(i == verticePila.aristas.length-1) turno = "c"
          ++x
          if(x == verticePila.aristas.length) x = 0
        }
    } else {
      if (verticeCola.grado == 1) {
        var w = grafo.vertices[indiceDeNodo(grafo, verticeCola.aristas[0])]
        //console.log("acolando"+w.label+"-"+verticeCola.label);
        //cola.push(w)
        cola.push({"arista":verticeCola.label+"-"+w.label})
        //console.log(cola);
        //console.log(pila);
        eliminarArista(grafo, verticeCola.label, w.label)
        verticeCola = w
        turno = "p"
      }else {
        turno = "p"
      }
    }
  }while(verticePila.grado != 0 && verticeCola.grado != 0 && hayAristas(grafo))
  if(hayAristas(grafo)){
    console.log();
    console.log("Grafo sin paseo cerrado de Euler");
    return
  }
  var camino = []
  var x = cola.length
  for (var i = 0; i < x; i++) {
    camino.push(cola.shift())
  }
  x = pila.length
  for (var i = 0; i < x; i++) {
    camino.push(pila.pop())
  }

  //console.log(camino);
  //console.log(cola.length);
  //console.log(pila);
  dude.send("marcarPCE", camino)
  console.log(camino);

}

function getGrado(nodo){
  return nodo.aristas.length
}

function getRandom(min, max) {
    return min + Math.floor(Math.random() * (max - min + 1));
}

function BFS(grafo, dude) {
  var arbol = {"vertices" : []}
  var queue = []
  agregarNodo(arbol, grafo.vertices[0].label)
  queue.push(grafo.vertices[0])

  do {
    var v = queue.shift()
    console.log("v" + v);
    for (var i = 0; i < v.aristas.length; i++) {
      var aux = indiceDeNodo(arbol, v.aristas[i])
      console.log(arbol.vertices);
      if(aux == -1){
        agregarNodo(arbol, v.aristas[i])
        agregarArista(arbol, v.label, v.aristas[i])
        if(arbol.vertices.length == graph.vertices.length){
          graph = arbol
          dude.send("marcarBFS", arbol)
          console.log("what");
          break
        }else {
          queue.push(graph.vertices[indiceDeNodo(arbol, v.aristas[i])])
        }
      }
    }
  } while (queue.length != 0);
  if(arbol.vertices.length != grafo.vertices.length){
    dude.send("rip", "expansion")
  }


}

function DFS(grafo, dude) {
  console.log(grafo);
  var arbol = {"vertices": []}
  agregarNodo(arbol, grafo.vertices[0].label, "marcado", null)
  grafo.vertices[0].conjunto = "marcado"
  //arbol.vertices.push(grafo.vertices[0])
  var v = grafo.vertices[0]
  var i = 0
  while (true) {
    //console.log(v.label+" arista" +v.arista[i]);
    i = 0
    for (i = 0; i < v.aristas.length; i++) {
      if(indiceDeNodo(arbol, v.aristas[i]) == -1){
        //console.log(grafo.vertices[indiceDeNodo(grafo,v.aristas[i])]);
        console.log("checando nodo"+v.label + "y su arista con "+v.aristas[i]);
        break
      }
    }
    console.log(v.aristas[i]);
    if(indiceDeNodo(arbol, v.aristas[i]) == -1 && v.aristas[i]){
      agregarNodo(arbol, v.aristas[i], "marcado", v)
      agregarArista(arbol, v.label, v.aristas[i])
      if(grafo.vertices.length == arbol.vertices.length){
        printGrafo(arbol)
        graph = arbol
        dude.send("marcarDFS", arbol)
        console.log("adadad");
        return
      }
      grafo.vertices[indiceDeNodo(grafo,v.aristas[i])].padre = v
      v = grafo.vertices[indiceDeNodo(grafo, v.aristas[i])]
      console.log("cambiando a nodo "+v.label);
    }else{
      console.log("cambiamos a padre");
      if(v.padre != undefined){
        v = v.padre
        i=0
      }else{
        console.log("asda");
        printGrafo(arbol)
        dude.send("rip", "expansion")
        console.log("nooooo");
        return
      }
    }
    printGrafo(arbol)
  }
}

function kruskal(grafo) {

}

function hayAristas(grafo){
  for (var i = 0; i < grafo.vertices.length; i++) {
    if(grafo.vertices[i].aristas.length != 0){
      return true
    }
  }
  return false
}


init();
// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
