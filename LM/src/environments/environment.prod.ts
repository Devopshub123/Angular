
export const environment = {
  production: true,

 /** spryple AWS */
  // apiUrl: 'http://13.232.185.196:6060/', 
  
 /** static QA-202 & demo -2121- URL*/
  apiUrl: 'http://122.175.62.210:202/',
  
  /** local build */
  // apiUrl: 'http://192.168.1.20:202/',
  
  dbName:sessionStorage.getItem('companyName'),
};
