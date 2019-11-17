class DinnerModel {

  constructor() {
    this.nrGuests = 0;
    this.menu = [];
  }

  //sets the number of guests
  setNumberOfGuests(num) {
    if(num < 1)
      num = 1;
    this.nrGuests = num;
  }

  //returns the number of guests
  getNumberOfGuests() {
    return this.nrGuests;
  }

  //Returns the dishes that are on the menu for selected type
  getSelectedDishes(type) {
    return this.menu.filter(dish => dish.dishTypes.includes(type));
  }

  //Returns all the dishes on the menu.
  getFullMenu() {
    return this.menu;
  }

  //Returns all ingredients for all the dishes on the menu.
  getAllIngredients() {
    var fullingredients = [];
    return this.menu.map(dish => dish.extendedIngredients.filter(ingredients => !fullingredients.includes(ingredients))).flat.map(x => x.name);
  }

  //Returns the total price of the menu (price per serving of each dish multiplied by number of guests).
  getTotalMenuPrice() {
    return this.menu.reduce((a,b) => a+b.pricePerServing, " ") * this.getNumberOfGuests();
  }

  //Adds the passed dish to the menu.
  addDishToMenu(dish) {
    if(this.menu.includes(dish)) {
      this.removeDishFromMenu(dish.id);
    }
    this.menu.push(dish);
  }

  //Removes dish with specified id from menu
  removeDishFromMenu(id) {
    this.menu = this.menu.filter(dish => dish.id !== id)
  }

  //Returns all dishes of specific type (i.e. "starter", "main dish" or "dessert").
  //query argument, text, if passed only returns dishes that contain the query in name or one of the ingredients.
  //if you don't pass any query, all the dishes will be returned
  getAllDishes(type, query) {
    document.getElementById("loader").style.display = "";
    if(!type)
      type = '' 
    if(!query)
      query = ''

    return fetch((ENDPOINT.concat("/recipes/search?type=")
    .concat(type).concat("&query=").concat(query)),
      {headers:{"X-Mashape-Key" : API_KEY }})
      .then(catchErrors)
      .then(response => response.json())
      .then(response => {
        document.getElementById("loader").style.display = "none";
        return response.results
      })
      .catch((error) => {
        console.log(error)
      });
  }

  //Returns a dish of specific ID
  getDish(id) {
    document.getElementById("loader").style.display = "";
    return fetch(ENDPOINT+"/recipes/"+id+"/information",
      {headers:{"X-Mashape-Key" : API_KEY }})
      .then(catchErrors)
      .then(response => {
        document.getElementById("loader").style.display = "none";
        return response.json()
      })

    .catch((error) => {
      console.log(error)
    });
  }
}

//the error handler
function catchErrors(resp) {
  if(resp.status === 200) {
    return resp;
  }
  else
    return resp;
}