module.exports = function(fields){
  return fields?.split(';')
               .filter(f => f)
               .map(f => '+'+f)
               .join(' ') || '';
}