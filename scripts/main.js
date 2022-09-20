const player_classes = {
	"Warrior":{
		"name" : "Warrior",
		"default_stats" : {
			"strenght"  : 5,
			"stamina"   : 3,
			"agility"   : 1,
			"intelligence" : 1,
		},
		"levelup_stats" : {
			"strenght"  : 3,
			"stamina"   : 2,
			"agility"   : 1,
			"intelligence" : 1,
		},
	},
	"Archer":{
		"name" : "Archer",
		"default_stats" : {
			"strenght"  : 1,
			"stamina"   : 3,
			"agility"   : 5,
			"intelligence" : 1,
		},
		"levelup_stats" : {
			"strenght"  : 1,
			"stamina"   : 2,
			"agility"   : 3,
			"intelligence" : 1,
		},
	},
	"Mage":{
		"name" : "Mage",
		"default_stats" : {
			"strenght"  : 1,
			"stamina"   : 3,
			"agility"   : 1,
			"intelligence" : 5,
		},
		"levelup_stats" : {
			"strenght"  : 1,
			"stamina"   : 2,
			"agility"   : 1,
			"intelligence" : 3,
		},
	},
}

const constantes = {
	"player_max_level" : 60,
}

const list_items = {
	1 : {
		"NAME" : "Shortsword",
		"DMG" : 3,
		"AS" : 2.60,
		"PRICE" : 10,
		"LEVEL" : 1,
		"TYPE" : "Weapon"
	},
	2 : {
		"NAME" : "Woodland Tunic",
		"AGI" : 2,
		"PRICE" : 50,
		"LEVEL" : 1,
		"TYPE" : "Armor"
	}
}

//xp formula XP = (Char Level * 5) + 45

class Inventory {
	constructor (inventory){
		this.inventory = inventory
		this.add_Item(1,1,1)
		this.add_Item(1,1,0)
		this.add_Item(2,1,0)
		this.add_Item(2,10,0)

		this.update_Inventory()
	}

	update_Inventory(){
		let inventory_display = []
		$.each( this.inventory, function( key, val ) {
			let button_equip = val.equiped === 0 ? "<button type='button' class='btn btn-primary btn-equipe'> Equipe </button>" : "<button type='button' class='btn btn-warning btn-unequipe'> Unequipe </button>"
			let button_sell = '<button sell='+ key +' type="button" class="btn btn-danger btn-item-sell">Sell</button>'
			inventory_display.push( "<div class='col-6 align-self-center'>" + JSON.stringify(list_items[val.item_id].NAME) + " x"+ val.item_quantity +"</div><div class='col-6 align-self-center'>" + button_equip + button_sell + "</div>" );
		});
		$(".inventory-display").html(inventory_display);
	}
	
	get_Item(){
		
	}
	
	add_Item(item_id,item_quantity, equiped){
		let i = Object.keys(this.inventory).length
		this.inventory[i] = {
			item_id, 
			item_quantity, 
			equiped
		}

		this.update_Inventory()
	}
	
	equip_Item(){

		this.update_Inventory()
	}
	
	deequip_Item(){

		this.update_Inventory()
	}

	sell_Item(id){
		player.gold += list_items[this.inventory[id].item_id].PRICE

		if(this.inventory[id].item_quantity >= 2){
			this.inventory[id].item_quantity -= 1
		}else {
			delete this.inventory[id]
		}
		this.update_Inventory()
	}
}

class Player {
	save(data) {
		console.log("saved : " + JSON.stringify(data))
		localStorage.player = JSON.stringify(data)
	}

	load() {
		if (localStorage.player) {
			console.log("load: " + localStorage.player)
			let player = JSON.parse(localStorage.player)
			this.classe = player.classe            
			this.stats = player.stats
			this.level = player.level
			this.gold = player.gold
		}
	}
	
	constructor(classe, stats, inventory){
		this.classe = classe
		this.stats = stats
		this.level = 1
		this.max_health = this.stats.stamina * 10
		this.health = this.max_health
		this.gold = 0
		// this.inventory = inventory

		let player_display = []
		$.each( this, function( key, val ) {
			if (key === "stats") {
				$.each(val, function ( stat, value) {
					player_display.push( "<li id='" + stat + "'>" + stat + " : " + value + "</li>" );
				})
			}else{
				player_display.push( "<li id='" + key + "'>" + key + " : "+ val + "</li>" );
			}
		});
		
		$( "<ul/>", {
			"class": "my-new-list",
			html: player_display.join( "" )
		}).appendTo( ".player-display" );
	}

	levelup() {
		if (this.level !== constantes.player_max_level) {
			this.stats.strenght += player_classes[this.classe].levelup_stats.strenght
			this.stats.stamina += player_classes[this.classe].levelup_stats.stamina
			this.stats.agility += player_classes[this.classe].levelup_stats.agility
			this.stats.intelligence += player_classes[this.classe].levelup_stats.intelligence
			this.level += 1
			console.log((this.level * 5) + 45)
		} else {
			console.log("max level reached")
		}
	}

	attack() {
		//AP egal main stat (str, agi, int)
		//damage = base_weapon_damage + (weapon_speed * Attack Power / 14)
		// let normalized_damage = base_weapon_damage + (X * this.stats.strenght / 14)
		let normalized_damage = Math.round(2 + (1.6 * this.stats.strenght / 14))
		console.log(normalized_damage)
	}

	update_player() {
		let health = '<div class="progress">'+
			'<div class="progress-bar bg-success" role="progressbar" style="width:'+this.health/this.max_health*100+'%" aria-valuenow="'+this.health+'" aria-valuemin="0" aria-valuemax="'+this.max_health+'"></div>'+
		'</div>'
	}
}

class Monster {
	constructor(name, stats, level) {
		this.name = name
		this.stats = stats
		this.level = level
		this.max_health = this.stats.stamina * 10
		this.health = this.max_health

		//remove disabled on button btn-player-attack
		$('#btn-player-attack').prop("disabled", false);
	}

	update_health(health) {
		this.health -= health
		if (this.health <= 0) {
			console.log('dead')
			$('#monster-healther-bar').attr("aria-valuenow", 0).css('width', '0%').text('')
		} else {
			$('#monster-healther-bar').attr("aria-valuenow", this.health).css('width', this.health/this.max_health*100+'%').text(this.health)
		}
	}
}



const player_inventory = new Inventory(new Object())
const player = new Player(player_classes.Warrior.name, player_classes.Warrior.default_stats)
let monster

console.log(player)
console.log(player_inventory)

player.load()
console.log(player)
player.save(player)


$( "#btn-lvlup" ).click(function() {
	player.levelup()
	console.log(player)
});

$( "#btn-save" ).click(function() {
	player.save(player)
	console.log(player)
});

$( "#btn-player-attack" ).click(function() {
	console.log('clicked')
	player.combat = setInterval(function(){ 
		player.attack()
		monster.update_health(player.stats.strenght)
		if (monster.health <= 0) {
			console.log('aaaa')
			clear()
		}

		function clear() {
            clearInterval(player.combat) 
       return clear;
	}

	}, (1.6*1000));
});


$(".inventory-display").on('click', '.btn-item-sell', function () {
	player_inventory.sell_Item($(this).attr("sell"))
});

$( "#btn-monster" ).click(function() {
	monster = new Monster("slime", {"strenght":2,"stamina":1}, 1)
	console.log(monster)
	let items = []
	$.each( monster, function( key, val ) {
		if (key === "stats") {
			console.log(val)
			$.each(val, function ( stat, value) {
				items.push( "<li id='" + stat + "'>" + stat + " : " + value + "</li>" );
			})
		}else{
			items.push( "<li id='" + key + "'>" + key + " : "+ val + "</li>" );
		}
	  });

	  	let health = '<div class="progress">'+
			'<div id="monster-healther-bar" class="progress-bar bg-success" role="progressbar" style="width:'+monster.health/monster.max_health*100+'%" aria-valuenow="'+monster.health+'" aria-valuemin="0" aria-valuemax="'+monster.max_health+'">'+monster.health+'</div>'+
		'</div>'

		items.push(health)
	 
	  $( "<ul/>", {
		"class": "my-new-list",
		html: items.join( "" )
	  }).appendTo( ".monster-display" );
});