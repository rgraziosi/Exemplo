// JavaScript Document
var app = new Vue({
	el: '#vue',
	data: {
		posts: [],
		filtro:''
	},
	computed: {
		
		filtrePosts(){			
			if(this.filtro){
				let exp = new RegExp(this.filtro.trim(), 'i');			
				let result = this.posts.links.filter(post => exp.test(post.meta.title));
				if(result.length == 0){
					alert('Sem resultados para pesquisa');
				}
				return result;
			} else {
				return this.posts.links;
			}
		}
		
	},
	methods: {
		getCategory: post => {
			switch(post.category){
				case 'ux_ui':
					return 'UX and UI'
					break;
				case 'case_study':
					return 'Case Study'
					break;
				case 'product_design':
					return 'Product Desing'
					break;
				case 'discussion':
					return 'Discussion'
					break;
				default:
					return 'All'
					break;					
			}
		},
		getImageAuthor: author =>{
			return './imagens/'+author+'.png';
		},
		getTimeAgo: timeStamp => {
			let date1 = new Date(timeStamp * 1000);
			let date2 = new Date();			
			
			let difference = date2.getTime() - date1.getTime();
			
			if(!difference){ return ""; }
			
			//Years
			let yearsDifference = Math.floor(difference/1000/60/60/24/30/12);
			difference -= yearsDifference*1000*60*60*24*30*12;			
			if(yearsDifference > 0){return yearsDifference+" year/s ago"};
			
			//Months
			let monthsDifference = Math.floor(difference/1000/60/60/24/30);
			difference -= monthsDifference*1000*60*60*24*30;			
			if(monthsDifference > 0){return monthsDifference+" month/s ago"};
			
			//Days
			let daysDifference = Math.floor(difference/1000/60/60/24);
			difference -= daysDifference*1000*60*60*24;			
			if(daysDifference > 0){return daysDifference+" day/s ago"};
			
			//Hours
			let hoursDifference = Math.floor(difference/1000/60/60);
			difference -= hoursDifference*1000*60*60			
			if(hoursDifference > 0){return hoursDifference+" hour/s ago"}
			
			//Minutes
			let minutesDifference = Math.floor(difference/1000/60);
			difference -= minutesDifference*1000*60				
			if(minutesDifference > 0){return minutesDifference+" minute/s ago"}
			
			//Seconds
			let secondsDifference = Math.floor(difference/1000);			
			return secondsDifference+" second/s ago";			
						
		}
		
	},
	created() {
		let promise = this.$http.get('https://www.mocky.io/v2/5a6bc16631000078341b8b77');
		
		promise
			.then(res => res.json())
			.then(posts => {
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
				
				this.posts = posts
			}, err => alert('Ocorreu um erro com a requisição de dados :'+err));		
	},
	
});