import { registerRootComponent } from 'expo';
import App from './App';

console.log("Index.js loaded, about to register");
registerRootComponent(App);
console.log("App registered");