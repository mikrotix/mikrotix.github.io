function generateScript(model) {
  const ispLine = Object.keys(model).length / 2;
  let results = "# Load Balance Nth\n";
  let addressList =
    "/ip firewall address-list\nadd address=192.168.0.0/16 list=LOCAL-IP\nadd address=172.16.0.0/12 list=LOCAL-IP\nadd address=10.0.0.0/8 list=LOCAL-IP\n";
  let firewallNat = "/ip firewall nat\n";
  let route = "/ip route\n";
  let mangle = "/ip firewall mangle\n";
  let gatewayNum = 1;
  let mangleNum = 1;
  for (let index = 1; index <= ispLine; index++) {
    if (
      Object.prototype.hasOwnProperty.call(model, `isp${index}`) &&
      Object.prototype.hasOwnProperty.call(model, `gateway${index}`)
    ) {
      let interfaceIsp = model[`isp${index}`];
      let gatewayIsp = model[`gateway${index}`];
      if (!firewallNat.includes(interfaceIsp)) {
        firewallNat += `add chain=srcnat out-interface="${interfaceIsp}" action=masquerade\n`;
      }
      if (!route.includes(gatewayIsp)) {
        route += `add check-gateway=ping distance=1 gateway="${gatewayIsp}" routing-mark="to-isp${index}"\n`;
        route += `add check-gateway=ping distance=${gatewayNum} gateway="${gatewayIsp}"\n`;
        gatewayNum += 1;
      }
      if (!mangle.includes(interfaceIsp)) {
        mangle += `add action=mark-connection chain=prerouting in-interface="${interfaceIsp}" new-connection-mark="cm-isp${index}" passthrough=yes\n`;
        mangle += `add action=mark-routing chain=output connection-mark="cm-isp${index}" new-routing-mark="to-isp${index}" passthrough=yes\n`;
        mangle += `add action=mark-connection chain=prerouting dst-address-list=!LOCAL-IP new-connection-mark="cm-isp${mangleNum}" passthrough=yes connection-state=new nth=${ispLine},${index} src-address-list=LOCAL-IP\n`;
        mangle += `add action=mark-routing chain=prerouting connection-mark="cm-isp1" dst-address-list=!LOCAL-IP new-routing-mark="to-isp${index}" passthrough=no src-address-list=LOCAL-IP\n`;
        mangleNum += 1;
      } else {
        mangle += `add action=mark-connection chain=prerouting dst-address-list=!LOCAL-IP new-connection-mark="cm-isp${mangleNum}" passthrough=yes connection-state=new nth=${ispLine},${index} src-address-list=LOCAL-IP\n`;
        mangleNum += 1;
      }
    }
  }
  results += addressList;
  results += firewallNat;
  results += mangle;
  results += route;
  return results;
}

function updateForm(controlModel) {
  const value = controlModel.select;
  const fields = [];
  for (let index = 1; index <= value; index++) {
    let fieldInterface = {
      id: `isp${index}`,
      key: `isp${index}`,
      name: `isp${index}`,
      type: "input",
      defaultValue: `ether${index}`,
      templateOptions: {
        label: `WAN ISP-${index}`,
        placeholder: `ether${index}`,
        description: `The interface of ISP ${index}`,
        required: true,
      },
    };
    let fieldGateway = {
      id: `gateway${index}`,
      key: `gateway${index}`,
      name: `gateway${index}`,
      type: "input",
      defaultValue: `192.168.${index}.1`,
      templateOptions: {
        label: `Gateway ISP-${index}`,
        placeholder: `192.168.${index}.1`,
        description: `The IP Gateway of ISP ${index}`,
        required: true,
      },
    };
    fields.push(fieldInterface);
    fields.push(fieldGateway);
  }
  return fields;
}
