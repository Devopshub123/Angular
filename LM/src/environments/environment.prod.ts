
export const environment = {
  production: true,

 /** spryple AWS */
  // apiUrl: 'http://13.232.185.196:6060/',

 /** static QA-202 & demo -2121- URL*/
  apiUrl: 'http://122.175.62.210:6363/',


  /** local build */
  // apiUrl: 'http://192.168.1.10:6363/',

  dbName:sessionStorage.getItem('companyName'),
};
