// Iniciação do VUE.js para o controle do elemento definido
var app = new Vue({
    //Definição do elemento de controle
    el: "#vue",
    //Criação das variaveis
    data: {
        //Armazenamento dos POSTs
        posts: [],
        //Armazenamento do filtro
        filtro:""
    },
    //Ação disparada após o vue dos dados computados
    computed: {
        //função disparada a digitação do campo input
        filtrePosts(){            
            if(this.filtro){
                //Verificação por expressão regular e usando .filtre do js para retornar os match
                let exp = new RegExp(this.filtro.trim(), "i");            
                let result = this.posts.links.filter(post => exp.test(post.meta.title));
                //Caso não houver nenhum match uma msg de resposta é apresentada
                if(result.length == 0){
                    alert("Sem resultados para pesquisa");
                }
                return result;
            } else {
                //Caso nada for dgitado, retorna todos os posts
                return this.posts.links;
            }
        }
        
    },
    //Metodos para tratamento de conteudo
    methods: {
        //Tras o nome traduzido da categoria do post
        getCategory: post => {
            switch(post.category){
                case "ux_ui":
                    return "UX and UI";
                case "case_study":
                    return "Case Study";
                case "product_design":
                    return "Product Desing";
                case "discussion":
                    return "Discussion";
                default:
                    return "All";                
            }
        },
        //A partir do nome do author é montado o caminho para imagem
        getImageAuthor: author =>{
            return "./imagens/"+author+".png";
        },
        //Verifica quanto tempo a publicação foi realizada, por ordem de importancia
        getTimeAgo: timeStamp => {
            let date1 = new Date(timeStamp * 1000);
            let date2 = new Date();            
            
            let difference = date2.getTime() - date1.getTime();
            
            if(!difference){ return ""; }
            
            //Years
            let yearsDifference = Math.floor(difference/1000/60/60/24/30/12);
            difference -= yearsDifference*1000*60*60*24*30*12;            
            if(yearsDifference > 0){return yearsDifference+" year/s ago";}
            
            //Months
            let monthsDifference = Math.floor(difference/1000/60/60/24/30);
            difference -= monthsDifference*1000*60*60*24*30;            
            if(monthsDifference > 0){return monthsDifference+" month/s ago";}
            
            //Days
            let daysDifference = Math.floor(difference/1000/60/60/24);
            difference -= daysDifference*1000*60*60*24;            
            if(daysDifference > 0){return daysDifference+" day/s ago";}
            
            //Hours
            let hoursDifference = Math.floor(difference/1000/60/60);
            difference -= hoursDifference*1000*60*60;            
            if(hoursDifference > 0){return hoursDifference+" hour/s ago";}
            
            //Minutes
            let minutesDifference = Math.floor(difference/1000/60);
            difference -= minutesDifference*1000*60;                
            if(minutesDifference > 0){return minutesDifference+" minute/s ago";}
            
            //Seconds
            let secondsDifference = Math.floor(difference/1000);            
            return secondsDifference+" second/s ago";          
                        
        }
        
    },
    //Disparo após o VUE ser criado
    created() {
        //Request dos posts
        let promise = this.$http.get("https://www.mocky.io/v2/5a6bc16631000078341b8b77");
        
        promise
            .then(res => res.json())
            .then(posts => {
                //Pré filtro dos posts seguido a ordem DATA > UP VOTES > COMMENTS
                posts.links.sort(function (a, b) {
                        var aupvotes = a.upvotes;
                        var bupvotes = b.upvotes;
                        
                        var acreated_at = (a.created_at) ? a.created_at : 0;
                        var bcreated_at = (b.created_at) ? b.created_at : 0;
                    
                        var acomments = a.comments;
                        var bcomments = b.comments;
                    
                        if(acreated_at == bcreated_at){
                            if(aupvotes == bupvotes){                            
                                return (acomments > bcomments) ? -1 : (acomments < bcomments) ? 1 : 0;
                            }
                            return (aupvotes > bupvotes) ? -1 : 1;                            
                        } else {
                            return (acreated_at > bcreated_at) ? -1 : 1;
                        }
                    });
                //Popular os posts para a tela
                this.posts = posts;
            }, err => alert("Ocorreu um erro com a requisição de dados :"+err));        
    },
    
});