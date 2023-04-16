export const saveCity=(city)=>{
    const cityHistory = localStorage.getItem('cities') ? JSON.parse(localStorage.getItem('cities')) : [];
    if(!cityHistory.includes(city) && city!==""){
        cityHistory.push(city);
    }
    if(cityHistory.length>=7)
    {
        cityHistory.shift();
    }
    localStorage.setItem('cities',JSON.stringify(cityHistory));
}

export const getCities=()=>{
    const cities = localStorage.getItem('cities') ? JSON.parse(localStorage.getItem('cities')) : [];
    return cities;
}

export const getCity=()=>{
    const cities = localStorage.getItem('cities') ? JSON.parse(localStorage.getItem('cities')) : [];
    return cities;
}

export const clearCities=(callback)=>{
    localStorage.removeItem('cities');
    callback();
}