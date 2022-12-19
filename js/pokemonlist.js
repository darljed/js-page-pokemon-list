class PokemonList{
    
    constructor(){
        this.getData()
        this.handlers()
        
        
    }
    

    getData(){
        const self=this;
        $.get("https://pokeapi.co/api/v2/pokemon?offset=30&limit=30", function(data, status){
            // console.log(data);
            this.results = data.results;
            this.next = data.next;
            this.prev = data.previous;

            self.cardlistRender(this.results)
        });
    }

    getInfo(url,callback){
            const self=this;
            $.get(url, function(data, status){
                // console.log(data);
                callback(data)
                $("#pokemonModal").modal("show")
                // this.current = data
            });
    }

    cardlistRender(data){
        let html='';
        for(var x=0;x<data.length;x++){
            const pokemonID = data[x].url.split("/")[6]

            html+=`<div class="col-lg-4 col-md-6 col-sm-12">
                <div class="cardlist-item item-click" data-targetid="`+data[x].url+`">
                    <div class="cardlist-item-header">
                        <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-i/red-blue/back/`+pokemonID+`.png" class="cardlist-item-thumb">
                        <h1>`+data[x].name+`</h1>
                    </div>
                    <div class="cardlist-item-body">
                        <div class="cardlist-item-mainart" style="background-image: url('https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/`+pokemonID+`.png')"></div>
                    </div>
                </div>
            </div>`
        }
        if(data.length == 0){
            html = `<div class="col-12 pt-5">
                <h1 class="text-center p-5">No Results Found</h1>
            </div>`
        }
        
        $("#cardlist-container").html(html)
    }

    renderModal(data){
        const modalID = {
            label: "ModalLabel",
            art:"modalArt",
            type: "modalType",
            ability: "modalAbility",
            sprite: "modalSprite"
        }
        const self = this
        // console.log(data.sprites.other['official-artwork'].front_default)
        // name
        $("#"+modalID.label).text(data.name)

        // image Art
        $("#"+modalID.art).css('background-image',`url('`+data.sprites.other['official-artwork'].front_default+`')`)

        //type
        let typehtml = ''
        for(var i = 0;i<data.types.length; i++){
            typehtml += `<span>`+data.types[i].type.name+`</span>`
        }
        $("#"+modalID.type).html(typehtml)

        
        //ability
        let abilityhtml = ''
        for(var i = 0;i<data.abilities.length; i++){
            abilityhtml += `<span>`+data.abilities[i].ability.name.replace("-"," ")+`</span>`
        }
        $("#"+modalID.ability).html(abilityhtml)

        //images
        let imageshtml = ''
        let keys = Object.keys(data.sprites);
        for(var i = 0; i<keys.length; i++){
            if(typeof(data.sprites[keys[i]]) === "string"){
                imageshtml +=`
                <img src="`+data.sprites[keys[i]]+`" data-toggle="tooltip" data-placement="top" class="modal-sprite-item" title="`+keys[i].replace("_"," ")+`">`
            }
        }
        $("#"+modalID.sprite).html(imageshtml)
        $('[data-toggle="tooltip"]').tooltip()


    }

    handlers(){
        const self=this;

        $(document).on('click','.item-click',function(){
            const target= $(this).data("targetid")
            self.getInfo(target,self.renderModal)
            
        })
    }
}