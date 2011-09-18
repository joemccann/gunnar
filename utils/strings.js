// These are used is used in the auth form. 
// I put it here so I could add/remove hardcoded values, like API keys, while testing.
exports.authForm = [
      {
        id:'Username', 
        required:true,
        value: '',
        tip:"Enter your Rackspace Account username."}, 
      {
        id:'Apikey', 
        required:true,
        value: '',
        tip:"Enter your Rackspace API Key."},
      {
        id:'Host', 
        required:true, 
        value: 'auth.api.rackspacecloud.com',
        tip:"Enter your Rackspace API host.",
        placeholder: ""
      }
    ] 
    
exports.cli = {
  wgetIndex: "wget -O public/index.html http://127.0.0.1:3000",
  wgetResults: "wget -O public/results.html http://127.0.0.1:3000/results",
  rmIndex: "rm -f public/index.html"
}