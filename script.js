function main() {
  const h1 = document.createElement('h1');
  const text = document.createTextNode('Hello');
  h1.appendChild(text);
  document.body.appendChild(h1);
}

main();
