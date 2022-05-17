import moment from "moment";

export default () => ({
  routes: [
    {
      destination: "Makhaza",
      people: [],
      taxis: [],
      departed: [],
      noPeople: 0,
    },
    {
      destination: "Belhar",
      people: [],
      taxis: [],
      departed: [],
      noPeople: 0,
    },
    {
      destination: "Bellville",
      people: [],
      taxis: [],
      departed: [],
      noPeople: 0,
    },
  ],

  init() {
    if (localStorage.getItem("routes")) {
      this.routes = JSON.parse(localStorage.getItem("routes"));
    }
    setInterval(() => this.detailedRoutes, 6000);
  },

  routeIndex(destination) {
    return this.routes.findIndex((route) => route.destination == destination);
  },

  addPerson(destination) {
    const index = this.routeIndex(destination);
    this.routes[index].people = [...this.routes[index].people, new Date()];
  },
  removePerson(destination) {
    const index = this.routeIndex(destination);
    this.routes[index].people.shift();
  },
  addTaxi(destination) {
    const index = this.routeIndex(destination);
    this.routes[index].taxis = [...this.routes[index].taxis, new Date()];
  },

  updateQueue(index) {
    let people = this.routes[index].people;
    let taxis = this.routes[index].taxis;
    let departed = this.routes[index].departed;

    while (Math.floor(people.length / 11) > 0 && taxis.length > 0) {
      this.routes[index].departing = true;
      const departing = new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve();
        }, 5000);
      });
      departing.then(() => {
        this.routes[index].departing = false;
      });
      people.splice(0, 11);
      taxis.shift();
      this.routes[index].departed = [...departed, moment().toISOString()];
    }
  },

  waitTime(destination) {
    const queue = this.routes.find((route) => route.destination == destination);
    const milliseconds =
      queue.people.reduce((sum, time) => {
        return (
          sum + moment.duration(moment().diff(moment(time))).asMilliseconds()
        );
      }, 0) / queue.people.length;
    return moment.duration(milliseconds, "milliseconds").humanize();
  },

  avgWaitTime(destination) {
    return this.waitTime(destination);
  },

  recentlyDeparted(departed) {
    return departed.filter((time) =>
      moment(time).isBetween(moment().subtract(1, "hours"), moment())
    );
  },

  get detailedRoutes() {
    return this.routes.map((route, index) => {
      this.updateQueue(index);
      this.updateStorage();
      return {
        destination: route.destination,
        numPeople: route.people ? route.people.length : 0,
        nextTaxi: route.taxis[0]
          ? moment(route.taxis[0]).format("LT")
          : undefined,
        numTaxisWaiting: route.taxis.length,
        avgWaitTime: route.people[0]
          ? this.avgWaitTime(route.destination)
          : "There are no passengers waiting at this time.",
        numTaxisDeparted: route.departed
          ? this.recentlyDeparted(route.departed).length
          : 0,
        departing: route.departing ? route.destination : false,
      };
    });
  },

  updateStorage() {
    localStorage.setItem("routes", JSON.stringify(this.routes));
  },
});
