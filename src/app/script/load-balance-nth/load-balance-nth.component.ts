import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FormlyFieldConfig, FormlyFormOptions } from '@ngx-formly/core';

@Component({
  selector: 'app-load-balance-nth',
  templateUrl: './load-balance-nth.component.html',
  styleUrls: ['./load-balance-nth.component.scss']
})
export class LoadBalanceNthComponent implements OnInit {
  title = 'Load Balance NTH'
  description = 'Script generator Load Balance for Mikrotik RouterOS'

  controlForm = new FormGroup({});
  controlModel: any = {};
  controlOptions: FormlyFormOptions = {};
  controlFields: FormlyFieldConfig[] = [
    {
      key: 'select',
      type: 'select',
      templateOptions: {
        label: 'Select ISP line',
        placeholder: 'ISP',
        description: 'Select Number Your ISP Line',
        required: true,
        options: [
          { value: 2, label: "2 ISP" },
          { value: 3, label: "3 ISP" },
          { value: 4, label: "4 ISP" },
          { value: 5, label: "5 ISP" },
        ]
      }
    }
  ]

  mainForm = new FormGroup({});
  mainModel: any = {};
  mainOptions: FormlyFormOptions = {};
  mainFields: FormlyFieldConfig[] = []

  constructor() { }

  ngOnInit(): void {
    // this.updateForm()
  }

  updateForm(controlModel: any): any {
    const value: number = controlModel.select
    const fields: FormlyFieldConfig[] = []
    for (let index = 1; index <= value; index++) {
      let fieldInterface: FormlyFieldConfig = {
        key: `isp${index}`,
        type: 'input',
        templateOptions: {
          label: `WAN ISP-${index}`,
          placeholder: `ether${index}`,
          description: `The interface of ISP ${index}`,
          required: true,
        }
      }
      let fieldGateway: FormlyFieldConfig = {
        key: `gateway${index}`,
        type: 'input',
        templateOptions: {
          label: `Gateway ISP-${index}`,
          placeholder: `192.168.${index}.1`,
          description: `The IP Gateway of ISP ${index}`,
        }
      }
      fields.push(fieldInterface)
      fields.push(fieldGateway)
    }
    return fields;
  }

  generate(model: any): any {
    const ispLine = Object.keys(model).length
    let results: string = "# Load Balance Nth\n";
    let addressList: string = "/ip firewall address-list\nadd address=192.168.0.0/16 list=LOCAL-IP\nadd address=172.16.0.0/12 list=LOCAL-IP\nadd address=10.0.0.0/8 list=LOCAL-IP\n";
    let firewallNat: string = "/ip firewall nat\n";
    let route: string = "/ip route\n";
    let mangle: string = "/ip firewall mangle\n";
    let gatewayNum = 1;
    let mangleNum = 1;
    for (let index = 1; index <= ispLine; index++) {
      if (Object.prototype.hasOwnProperty.call(model, `isp${index}`) && Object.prototype.hasOwnProperty.call(model, `gateway${index}`)) {
        let interfaceIsp: string = model[`isp${index}`];
        let gatewayIsp: string = model[`gateway${index}`];
        if (!firewallNat.includes(interfaceIsp)) {
          firewallNat += `add chain=srcnat out-interface="${interfaceIsp}" action=masquerade\n`
        }
        if (!route.includes(gatewayIsp)) {
          route += `add check-gateway=ping distance=1 gateway="${gatewayIsp}" routing-mark="to-isp${index}"\n`;
          route += `add check-gateway=ping distance=${gatewayNum} gateway="${gatewayIsp}"\n`;
          gatewayNum += 1;
        }
        if (!mangle.includes(interfaceIsp)) {
          mangle += `add action=mark-connection chain=prerouting in-interface="${interfaceIsp}" new-connection-mark="cm-isp${index}" passthrough=yes\n`;
          mangle += `add action=mark-routing chain=output connection-mark="cm-isp${index}" new-routing-mark="to-isp${index}" passthrough=yes\n`;
          mangle += `add action=mark-connection chain=prerouting dst-address-list=!LOCAL-IP new-connection-mark="cm-isp${index}" passthrough=yes connection-state=new nth=${ispLine},${index} src-address-list=LOCAL-IP\n`;
          mangle += `add action=mark-routing chain=prerouting connection-mark="cm-isp1" dst-address-list=!LOCAL-IP new-routing-mark="to-isp${index}" passthrough=no src-address-list=LOCAL-IP\n`;
          mangleNum += 1;
        } else {
          mangle += `add action=mark-connection chain=prerouting dst-address-list=!LOCAL-IP new-connection-mark="cm-isp${index}" passthrough=yes connection-state=new nth=${ispLine},${index} src-address-list=LOCAL-IP\n`;
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

  clear(): void {
    this.mainModel = {}
  }

}
