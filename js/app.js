import routes from "./taxi-routes";
import Alpine from "alpinejs";

window.Alpine = Alpine;
Alpine.data("taxiRank", routes);
Alpine.start();
