
export const environment = {
  production: true,

 /** spryple AWS */
  // apiUrl: 'http://13.232.185.196:6060/',

 /** static QA-202 & demo -2121- URL*/
  apiUrl: 'http://122.175.62.210:7676/',

  /** local build */
  // apiUrl: 'http://192.168.1.10:7676/',

  /**-------------------------------------------------- */
  /**offline build */
  // apiUrl:'http://192.168.1.86:6060/',

  dbName:sessionStorage.getItem('companyName'),
};
