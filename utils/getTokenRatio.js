const DIA_ORACLES_ENDPOINTS = require("../constants/diaOraclesEndponts.json")
const { default: axios } = require("axios")

async function getTokenRatio(network, targetNetwork) {

  const ethOracleEndpoint = DIA_ORACLES_ENDPOINTS[network]
  const tokenOracleEndpoint = DIA_ORACLES_ENDPOINTS[targetNetwork]

  let response = await axios.get(ethOracleEndpoint)
  const ethSymbol = response.data['Symbol'].toUpperCase()
  const ethPrice = response.data['Price']
  response = await axios.get(tokenOracleEndpoint)
  const tokenSymbol = response.data['Symbol'].toUpperCase()
  const tokenPrice = response.data['Price']

  const ratio = ethPrice / tokenPrice
  const inversedRatio = tokenPrice / ethPrice

  return {
    ethSymbol,
    tokenSymbol,
    ratio,
    inversedRatio
  }
};

module.exports = getTokenRatio;