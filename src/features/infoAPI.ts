import SALESDATA from '../data_2021.json';


// A mock function to mimic making a request for data
export function fetchSales() {
    return SALESDATA[0];
}