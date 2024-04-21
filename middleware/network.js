const os = require('os');

exports.getNetworkRange = () => {
  const networkInterfaces = os.networkInterfaces();

  for (const interfaceName in networkInterfaces) {
    const networkInterface = networkInterfaces[interfaceName];

    for (const { address, netmask, family } of networkInterface) {
      // Check if it's an IPv4 address (family === 'IPv4')
      if (family === 'IPv4' && !address.startsWith('127.')) {
        // Calculate the network range
        const [ip, subnetBits] = netmask.split('/');
        const networkRange = calculateNetworkRange(ip, subnetBits);

        return networkRange;
      }
    }
  }

  return null; // Return null if no suitable network range is found
}

function calculateNetworkRange(ip, subnetBits) {
  const subnetSize = 32 - subnetBits;
  const hostCount = Math.pow(2, subnetSize);
  const networkAddress = ip.split('.').map((octet, index) => octet & (255 << (subnetSize * index)))
                          .join('.');
  return `${networkAddress}/${subnetBits}`;
}

// const networkRange = getNetworkRange();

// if (networkRange) {
//   console.log(`Detected network range: ${networkRange}`);
// } else {
//   console.log('Unable to detect network range.');
// }