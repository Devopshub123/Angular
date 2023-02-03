export const environment = {
  production: true,
  /** static url */
  // apiUrl: 'http://122.175.62.210:6464/',  spryple old
  // apiUrl: 'http://122.175.62.210:202/', payroll old
  
  /** local build */
  apiUrl:'http://192.168.1.20:202/',
  dbName:sessionStorage.getItem('companyName'),
};
