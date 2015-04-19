$('#myCheck').change(function(){
  chrome.runtime.sendMessage({method: 'setCheck', css:$(this).val()});
});