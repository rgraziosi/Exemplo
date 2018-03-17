// JavaScript Document
var app = new Vue({
  el: '#vue',
  data: {
    posts: [    ]
  },
	mounted() {
		fetch("https://www.mocky.io/v2/5a6bc16631000078341b8b77", {
			headers:{
				'Access-Control-Allow-Origin':'*',
				'crossDomain': 'false'
			}
		})
		.then(response => response.json())
		.then((data) => {
			this.posts = data.links;
		})
	}
});