function generateScript(model) {
  const ispLine = model.isp.length;
  if (ispLine < 2) return;
  let results = "# Load Balance Nth\n";
  let addressList =
    "/ip firewall address-list\nadd address=192.168.0.0/16 list=LOCAL-IP\nadd address=172.16.0.0/12 list=LOCAL-IP\nadd address=10.0.0.0/8 list=LOCAL-IP\n";
  let firewallNat = "/ip firewall nat\n";
  let route = "/ip route\n";
  let mangle = "/ip firewall mangle\n";
  let gatewayNum = 1;
  let mangleNum = 1;
  for (let index = 0; index < ispLine; index++) {
    let isp = model.isp[index];
    if (!firewallNat.includes(isp.interface)) {
      firewallNat += `add chain=srcnat out-interface="${isp.interface}" action=masquerade\n`;
    }
    if (!route.includes(isp.gateway)) {
      route += `add check-gateway=ping distance=1 gateway="${isp.gateway}" routing-mark="to-isp${index}"\n`;
      route += `add check-gateway=ping distance=${gatewayNum} gateway="${isp.gateway}"\n`;
      gatewayNum += 1;
    }
    if (!mangle.includes(isp.interface)) {
      mangle += `add action=mark-connection chain=input in-interface="${isp.interface}" new-connection-mark="cm-${isp.interface}" passthrough=yes\n`;
      mangle += `add action=mark-routing chain=output connection-mark="cm-${isp.interface}" new-routing-mark="to-${isp.interface}" passthrough=yes\n`;
      mangle += `add action=mark-connection chain=prerouting dst-address-list=!LOCAL-IP dst-address-type=!local new-connection-mark="cm-${
        isp.interface
      }" passthrough=yes per-connection-classifier=both-addresses-and-ports:${
        ispLine - 1
      }/${index} src-address-list=LOCAL-IP\n`;
      mangle += `add action=mark-routing chain=prerouting connection-mark="cm-${isp.interface}" dst-address-list=!LOCAL-IP new-routing-mark="to-${isp.interface}" passthrough=yes src-address-list=LOCAL-IP\n`;
      mangleNum += 1;
    } else {
      mangle += `add action=mark-connection chain=prerouting dst-address-list=!LOCAL-IP dst-address-type=!local new-connection-mark="cm-${
        isp.interface
      }" passthrough=yes per-connection-classifier=both-addresses-and-ports:${
        ispLine - 1
      }/${index} src-address-list=LOCAL-IP\n`;
      mangleNum += 1;
    }
  }
  results += addressList + "\n";
  results += firewallNat + "\n";
  results += mangle + "\n";
  results += route;
  return results;
}

function updateForm(controlModel) {
  return [];
}
