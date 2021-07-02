function generateScript(model) {
  if (model.isp.length < 2) return;
  let results = "# Load Balance Nth\n";
  let addressList =
    "/ip firewall address-list\nadd address=192.168.0.0/16 list=LOCAL-IP\nadd address=172.16.0.0/12 list=LOCAL-IP\nadd address=10.0.0.0/8 list=LOCAL-IP\n";
  let firewallNat = "/ip firewall nat\n";
  let route = "/ip route\n";
  let mangle = "/ip firewall mangle\n";
  let gateways = [];
  for (let index = 0; index < model.isp.length; index++) {
    let isp = model.isp[index];
    if (!firewallNat.includes(isp.interface)) {
      firewallNat += `add chain=srcnat out-interface="${isp.interface}" action=masquerade\n`;
    }
    if (!route.includes(isp.gateway)) {
      gateways.push(isp.gateway);
      route += `add check-gateway=ping distance=1 gateway="${isp.gateway}" routing-mark="to-${isp.interface}"\n`;
    }
    if (!mangle.includes(isp.interface)) {
      mangle += `add action=mark-connection chain=input in-interface="${isp.interface}" new-connection-mark="cm-${isp.interface}"\n`;
      mangle += `add action=mark-routing chain=output connection-mark="cm-${isp.interface}" new-routing-mark="to-${isp.interface}"\n`;
    }
  }
  let routeGateways = gateways.join(",");
  route += `add check-gateway=ping distance=1 gateway="${routeGateways}"\n`;
  results += addressList;
  results += firewallNat;
  results += mangle;
  results += route;
  return results;
}

function updateForm(controlModel) {
  return [];
}
