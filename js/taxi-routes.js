export default () => ({
  routes: [
    {
      destination: "Belhar",
      passengers: 0,
      taxis: 0,
      departed: 0,
      fare: 22.5,
    },
    {
      destination: "Bellville",
      passengers: 0,
      taxis: 0,
      departed: 0,
      fare: 15.5,
    },
    {
      destination: "Makhaza",
      passengers: 0,
      taxis: 0,
      departed: 0,
      fare: 18.5,
    },
  ],

  newDestination: { destination: "", fare: 0 },
  totalTaxiIncome: 0,

  init() {
    if (localStorage.getItem("routeData")) {
      this.routes = JSON.parse(localStorage.getItem("routeData"));
    }
    this.checkRoutes();
  },

  findRoute(destination) {
    return this.routes.findIndex(
      (route) =>
        route.destination.toLowerCase().trim() ==
        destination.toLowerCase().trim()
    );
  },

  addNewRoute() {
    if (
      this.newDestination.destination &&
      this.newDestination.destination.length > 0
    ) {
      const index = this.findRoute(this.newDestination.destination);

      if (
        index == -1 &&
        Number(this.newDestination.fare) &&
        Number(this.newDestination.fare) > 0
      ) {
        this.routes.push({
          destination: this.newDestination.destination,
          passengers: 0,
          taxis: 0,
          departed: 0,
          fare: Number(this.newDestination.fare),
        });

        this.newDestination.fare = 0;
        this.newDestination.destination = "";
        this.checkRoutes();
      }
    }
  },

  addPassenger(destination, noPassengers) {
    const index = this.findRoute(destination);
    this.routes[index].passengers++;
  },
  removePassenger(destination, noPassengers) {
    const index = this.findRoute(destination);
    this.routes[index].passengers -= this.routes[index].passengers == 0 ? 0 : 1;
  },

  addTaxi(destination, taxiNo) {
    const index = this.findRoute(destination);
    this.routes[index].taxis++;
  },

  boardPassenger(destination) {
    const index = this.findRoute(destination);
    this.updateQueue(index);

    this.checkRoutes();
  },

  updateQueue(index) {
    const maxPassenger = 15;
    const taxiPassengers = this.routes[index].taxis * maxPassenger;

    if (
      this.routes[index].passengers >= maxPassenger &&
      this.routes[index].taxis > 0
    ) {
      let remain = this.routes[index].passengers % maxPassenger;
      const neededTaxis =
        (this.routes[index].passengers - remain) / maxPassenger;

      if (this.routes[index].taxis >= neededTaxis) {
        this.routes[index].taxis -= neededTaxis;
        this.routes[index].departed += neededTaxis;
      } else {
        remain += (neededTaxis - this.routes[index].taxis) * maxPassenger;

        this.routes[index].departed += this.routes[index].taxis;
        this.routes[index].taxis = 0;
      }

      this.routes[index].passengers = remain;
    }
  },

  checkRoutes() {
    this.totalTaxiIncome = 0;
    this.saveRoutes();
    return this.routes.map((route, index) => {
      this.totalTaxiIncome += route.fare * route.departed;
      return {
        destination: route.destination,
        numPassengers: route.passengers,
        noPassengers: 0,
        taxiNo: 0,
        taxiQueue: route.taxis,
        fare: route.fare,
        departed: route.departed,
        income: Number(route.fare * route.departed).toFixed(2),
      };
    });
  },
  getTotalAmount() {
    return Number(this.totalTaxiIncome).toFixed(2);
  },

  saveRoutes() {
    localStorage.setItem("routeData", JSON.stringify(this.routes));
  },
});
