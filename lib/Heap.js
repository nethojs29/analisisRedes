var collections =(function(co){
	co.swap = function(arr, idx1, idx2){
		var aux = arr[idx1];
		arr[idx1] = arr[idx2];
		arr[idx2] = aux;
	};

	/**
	@param{Boolean}isMax whether it is true the bigest element will
	be on top otherwise the smallest will be the head
	*/
	co.Heap = function(isMax){
		this.isMax = isMax == true;
		this.queue = [null];
		this.size = 0;

		/**
		@param{Object}value element
		@param{function}isSmallerFunction function of a parameter that returns
		true if value is less than the parameter
		*/
		this.element = function(value, isSmallerFunction){
			this.value = value;
			this.isSmaller = isSmallerFunction;
		};

		/**
		@param{collections.Heap.element}element element
		 added to the heap
		*/
		this.insert = function(element){
			this.queue.push(element);
			this.size ++;
			this.up(this.size);

		};
		/**
		@returns{collections.Heap.element} the first element
		*/
		this.peek = function(){
			return this.queue[1];
		};

		/**
		deletes the first element and reorders the heap
		@returns{collections.Heap.element} the first element
		*/
		this.pop = function(){
			if(this.size < 1){ return null;}
			co.swap(this.queue, 1, this.size --);
			var poped = this.queue.pop();
			this.down(1);
			return poped;
		};

		this.down = function(idx){
			var next = 2*idx;
			if(next > this.size){
				return;
			} else if(this.queue[next + 1] != null){
				var isSmaller = this.queue[next].isSmaller(this.queue[next + 1]);
				var chooseNext = this.isMax? isSmaller: !isSmaller;
				if(chooseNext){
					next ++;
				}
			}
			var isSmaller = this.queue[idx].isSmaller(this.queue[next]);
			var goDown = this.isMax? isSmaller: !isSmaller;
			if(goDown){
				co.swap(this.queue, idx, next);
				this.down(next);
			}

		};

		this.up = function(idx){
			var ih = Math.floor(idx/2);
			if(ih < 1){	return;}
			var isSmaller = this.queue[ih].isSmaller(this.queue[idx]);
			var goUp = this.isMax? isSmaller: !isSmaller;
			if(goUp){
				co.swap(this.queue, idx, ih);
				this.up(ih);
			}
		};


		this.toString = function(){
			var str = "";
			for(i = 1; i< this.queue.length; i++){
				str += this.queue[i].value.costo+" ";
			}
			return str;
		};
	};

	return co;
})(collections || {});
