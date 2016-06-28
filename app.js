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

  // 1 acre x 6-7" deep = 2 million lbs soil

  // http://www.lamotte.com/en/browse/5029.html 
  // http://www.lamotte.com/images/pdf/instructions/36070.pdf
  // Model STH-14
  // Code 5010-01

  var known_fert_types = [
						  {
						  name: "10-10-10",
						  n: 0.10,
						  p: 0.10,
						  k: 0.10
						  },

						  {
						  name: "cow manure (20-0-0) ",
						  n: 0.02,
						  p: 0.0,
						  k: 0.0,

						  n_avail: 0.3,
						  p_avail: 0.3,
						  k_avail: 0.5
						  }
						  ];

  // http://www.gemplers.com/docs/manual/RLMCMANUAL.pdf

  var known_crop_types = [
						  {
						  name: "corn",
						  n: 240,
						  p2o5: 100,
						  k2o: 240
						  },

						  {
						  name: "potatoes",
						  n: 125,
						  p2o5: 20,
						  k2o: 170
						  }
						  ];

  var my_crops = [];
  

  app.controller("FertilizerController", function($scope) {

	  //====================
	  // area
	  //====================

	  this.field_size = 3000;
	  this.field_units = "ftsquare";
	  this.field_ftsquare = function() { return( this.field_size * (this.field_units === "ftsquare" ? 1 : 43560 )) }
	  this.field_acres    = function() { return( this.field_size * (this.field_units === "ftsquare" ? (1 / 43560) : 1 )) }

	  //====================
	  // soil
	  //====================

	  this.soil_units = "lbsa";
	  this.n = 15;
	  this.p = 100;
	  this.k = 75;

	  this.n_lbsa = function() { return( this.n * (this.soil_units === "lbsa" ? 1 : 2)) }
	  this.p_lbsa = function() { return( this.p * (this.soil_units === "lbsa" ? 1 : 2)) }
	  this.k_lbsa = function() { return( this.k * (this.soil_units === "lbsa" ? 1 : 2)) }

	  // convert from p -> p2o5 ; k -> k2o
	  this.p2o5_lbsa = function() { return( this.p_lbsa() * 2.3) }
	  this.k2o_lbsa  = function() { return( this.k_lbsa() * 1.2) }


	  this.n_soil_available_lbsa = function() { return (this.n_lbsa() * 0.4);}
	  this.p2o5_soil_available_lbsa = function() { return (this.p2o5_lbsa() * 0.4);}
	  this.k2o_soil_available_lbsa = function() { return (this.k2o_lbsa() * 0.4);}

	  //====================
	  // fertilizers
	  //====================

	  this.known_fert_types = known_fert_types;
	  this.fertilizer_lbsa = function()					{ return (this.fertilizer_lbs / this.field_acres() );}

	  this.n_fertilizer_lbsa = function()				{ return (this.fertilizer_lbsa() * (this.fertilizer_type ? this.fertilizer_type.n : 0) );}
	  this.p_fertilizer_lbsa = function()				{ return (this.fertilizer_lbsa() * (this.fertilizer_type ? this.fertilizer_type.p : 0) );}
	  this.k_fertilizer_lbsa = function()				{ return (this.fertilizer_lbsa() * (this.fertilizer_type ? this.fertilizer_type.k: 0) );}

	  this.p2o5_fertilizer_lbsa = function() { return( this.p_fertilizer_lbsa() * 2.3) }
	  this.k2o_fertilizer_lbsa  = function() { return( this.k_fertilizer_lbsa() * 1.2) }


	  
	  this.n_fertilizer_available_ratio = function()	{ return ((this.fertilizer_type && this.fertilizer_type.n_avail) ? this.fertilizer_type.n_avail : 0.6 ); }
	  this.p_fertilizer_available_ratio = function()	{ return ((this.fertilizer_type && this.fertilizer_type.p_avail) ? this.fertilizer_type.p_avail : 0.3 ); }
	  this.k_fertilizer_available_ratio = function()	{ return ((this.fertilizer_type && this.fertilizer_type.k_avail) ? this.fertilizer_type.k_avail : 0.5 ); }

	  this.n_fertilizer_available_lbsa = function()		{ return (this.n_fertilizer_lbsa()		* this.n_fertilizer_available_ratio() );}
	  this.p2o5_fertilizer_available_lbsa = function()	{ return (this.p2o5_fertilizer_lbsa()	* this.p_fertilizer_available_ratio());}
	  this.k2o_fertilizer_available_lbsa = function()	{ return (this.k2o_fertilizer_lbsa()	* this.k_fertilizer_available_ratio());}

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

	  // returns either "low", "good", or "high"
	  // ...which can be used as a CSS class
	  this.crop_suitability = function(crop_name, fert_name, fert_level) {
		
	  }

	  //====================
	  // total
	  //====================

	  this.n_total_available_lbsa = function() { return ( ( this.n_fertilizer_available_lbsa() || 0) + this.n_soil_available_lbsa() );}
	  this.p2o5_total_available_lbsa = function() { return ( ( this.p2o5_fertilizer_available_lbsa() || 0) + this.p2o5_soil_available_lbsa() );}
	  this.k2o_total_available_lbsa = function() { return ( ( this.k2o_fertilizer_available_lbsa() || 0) + this.k2o_soil_available_lbsa() );}



	}); // FertilizerController




 })();

