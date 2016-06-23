Array.prototype.diff = function(a) {
    return this.filter(function(i) {return a.indexOf(i) < 0;});
};


// fertangular
//
//

(function(){
  var app= angular.module('fertilizer',  []);

  // all fertilizers share the same 'per year availability rate':
  //   n = 0.3
  //   p = 0.3
  //   k = 0.5
  //...unless overridden (as 'manure' is)
  //

  // http://www.lundproduce.com/N-P-K-Value-of-Everything.html

  var known_fert_types = [
						  {
						  name: "10-10-10",
						  n: 0.10,
						  p: 0.10,
						  k: 0.10
						  },

						  {
						  name: "magic 10-50-10",
						  n: 0.10,
						  p: 0.50,
						  k: 0.10
						  },

						  {
						  name: "cow manure 10-10-10 ",
						  n: 0.1,
						  p: 0.1,
						  k: 0.1,

						  n_avail: 0.3,
						  p_avail: 0.3,
						  k_avail: 0.5
						  },

						  {
						  name: "cow manure actual ",
						  n: 0.2,
						  p: 0.0,
						  k: 0.0,

						  n_avail: 0.3,
						  p_avail: 0.3,
						  k_avail: 0.5
						  }
						  ];

  var known_crop_types = [
						  {
						  name: "corn",
						  n: 240,
						  p: 100,
						  k: 240
						  },

						  {
						  name: "potatoes",
						  n: 125,
						  p: 20,
						  k: 170
						  }
						  ];

  var my_crops = [];
  

  app.controller("FertilizerController", function($scope) {

	  //====================
	  // area
	  //====================

	  this.field_size = 1;
	  this.field_units = "acres";
	  this.field_ftsquare = function() { return( this.field_size * (this.field_units === "ftsquare" ? 1 : 43560 )) }
	  this.field_acres    = function() { return( this.field_size * (this.field_units === "ftsquare" ? (1 / 43560) : 1 )) }

	  //====================
	  // soil
	  //====================

	  this.soil_units = "lbsa";
	  this.n = 1;
	  this.p = 1;
	  this.k = 1;

	  this.n_lbsa = function() { return( this.n * (this.soil_units === "lbsa" ? 1 : 2)) }
	  this.p_lbsa = function() { return( this.p * (this.soil_units === "lbsa" ? 1 : 2)) }
	  this.k_lbsa = function() { return( this.k * (this.soil_units === "lbsa" ? 1 : 2)) }

	  this.n_soil_available_lbsa = function() { return (this.n_lbsa() * 0.4);}
	  this.p_soil_available_lbsa = function() { return (this.p_lbsa() * 0.4);}
	  this.k_soil_available_lbsa = function() { return (this.k_lbsa() * 0.4);}

	  //====================
	  // fertilizers
	  //====================

	  this.known_fert_types = known_fert_types;
	  this.fertilizer_lbsa = function() { return (this.fertilizer_lbs / this.field_acres() );}
	  this.n_fertilizer_lbsa = function() { return (this.fertilizer_lbsa() * (this.fertilizer_type ? this.fertilizer_type.n : 0) );}
	  this.p_fertilizer_lbsa = function() { return (this.fertilizer_lbsa() * (this.fertilizer_type ? this.fertilizer_type.p : 0) );}
	  this.k_fertilizer_lbsa = function() { return (this.fertilizer_lbsa() * (this.fertilizer_type ? this.fertilizer_type.k: 0) );}
	  
	  this.n_fertilizer_available_ratio = function() { return ((this.fertilizer_type && this.fertilizer_type.n_avail) ? this.fertilizer_type.n_avail : 0.6 ); }
	  this.p_fertilizer_available_ratio = function() { return ((this.fertilizer_type && this.fertilizer_type.p_avail) ? this.fertilizer_type.p_avail : 0.3 ); }
	  this.k_fertilizer_available_ratio = function() { return ((this.fertilizer_type && this.fertilizer_type.k_avail) ? this.fertilizer_type.k_avail : 0.5 ); }

	  this.n_fertilizer_available_lbsa = function() { return (this.n_fertilizer_lbsa() * this.n_fertilizer_available_ratio() );}
	  this.p_fertilizer_available_lbsa = function() { return (this.p_fertilizer_lbsa() * this.p_fertilizer_available_ratio());}
	  this.k_fertilizer_available_lbsa = function() { return (this.k_fertilizer_lbsa() * this.k_fertilizer_available_ratio());}

	  //====================
	  // crops
	  //====================

	  this.known_crop_types = known_crop_types;

	  this.unchosen_crop_types = function() {
		return( known_crop_types.diff( my_crops ));
	  };

	  this.my_crops = my_crops;

	  this.addCrop = function() {
		my_crops.push(this.crop_type);
		this.crop_type = {}; // clear out form
	  };

	  //====================
	  // total
	  //====================

	  this.n_total_available_lbsa = function() { return ( ( this.n_fertilizer_available_lbsa() || 0) + this.n_soil_available_lbsa() );}
	  this.p_total_available_lbsa = function() { return ( ( this.p_fertilizer_available_lbsa() || 0) + this.p_soil_available_lbsa() );}
	  this.k_total_available_lbsa = function() { return ( ( this.k_fertilizer_available_lbsa() || 0) + this.k_soil_available_lbsa() );}



	}); // FertilizerController




 })();

