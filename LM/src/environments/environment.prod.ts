export const environment = {
  production: true,
  /** static url */
  //spryple old
  // apiUrl: 'http://122.175.62.210:6464/',  
  
  //payroll old
  apiUrl: 'http://122.175.62.210:202/',
  
  /** local build */
  // apiUrl:'http://192.168.1.20:202/',
  dbName:sessionStorage.getItem('companyName'),
};
