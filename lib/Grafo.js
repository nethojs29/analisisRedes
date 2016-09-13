var lib = (function(co){
  co.Grafo = function() {
    this.vertices = []
    this.aristas = []


    this.indiceDeNodo = function(nodo){
      for (var i = 0; i < this.vertices.length; i++) {
        if (this.vertices[i].label == nodo){
          return i
        }
      }
      return -1
    };

    this.agregarNodo = function(etiqueta, marca=null, padre=null){
      this.vertices.push({"id": etiqueta,"label": etiqueta, "aristas":[], "conjunto": marca, "grado" : 0, "padre" : padre});
    };

    this.eliminarNodo = function(nodo){
      var ind = this.indiceDeNodo(nodo)
      if(ind != -1){
        this.vertices.splice(ind, 1)
        for (var i = 0; i < this.vertices.length; i++) {
          for (var j = 0; j < this.vertices[i].aristas.length; j++) {
            if(this.vertices[i].aristas[j] == nodo){
                console.log("nodo "+this.vertices[i].label + "tiene arista con "+nodo+"\n");
                this.vertices[i].aristas.splice(j,1)
                j=-1
            }
          }
        }
      }
    };

    this.agregarArista = function(inicio, destino, costo=0){
      var ind1 = this.indiceDeNodo(inicio)
      var ind2 = this.indiceDeNodo(destino)

      if(this.indiceDeNodo(inicio) == -1) this.agregarNodo(inicio)
      if(this.indiceDeNodo(destino) == -1) this.agregarNodo(destino)

      var x = this.indiceDeNodo(inicio)
      var y = this.indiceDeNodo(destino)

      this.aristas.push({"inicio": inicio,"destino": destino, "costo":costo})

      this.vertices[x].aristas.push({"destino": destino, "costo":costo})
      this.vertices[x].grado++
      this.vertices[y].aristas.push({"destino": inicio, "costo":costo})
      this.vertices[y].grado++
    };

    this.eliminarArista = function(inicio, destino){
      var ind1 = this.indiceDeNodo(inicio)
      var ind2 = this.indiceDeNodo(destino)

      var aux = grafo.vertices[ind1].aristas.indexOf(destino);
      var aux2 = grafo.vertices[ind2].aristas.indexOf(inicio)
      if(aux != -1 && aux2 != -2){
        this.vertices[ind1].aristas.splice(aux,1)
        this.vertices[ind1].grado--
        this.vertices[ind2].aristas.splice(aux2,1)
        this.vertices[ind2].grado--
      }else{
        console.log("Arista no existe");
      }
    };



  };
  return co;
})(lib || {});
