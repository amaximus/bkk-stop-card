
class BKKStopCard extends HTMLElement {

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  _getAttributes(hass,entity) {
    var res = [];
    var bikes = "";
    var icon;
    var max_items = this._config.max_items;
    var nr_of_items;
    var vehicle;
    var wheelchair = "";
    var nightbus = "";

    if (typeof hass.states[`${entity}`] != "undefined") {
      const data1 = hass.states[`${entity}`].attributes['vehicles'];
      const station = hass.states[`${entity}`].attributes['stationName'];

      if (data1.length > 0) {
        nr_of_items= max_items > 0 ? Math.min(data1.length,max_items) : data1.length;

        for(var i=0; i<nr_of_items; i++) {
          if (data1[i].hasOwnProperty('wheelchair')) {
            wheelchair='<ha-icon icon="mdi:wheelchair-accessibility" class="extraic">';
          }
          if (data1[i].hasOwnProperty('bikesAllowed')) {
            bikes='<ha-icon icon="mdi:bike" class="extraic">';
          }
          icon=data1[i].type.toLowerCase();
          vehicle=icon;
          if (icon == "trolleybus") {
            icon="bus"
          } else if (icon == "rail") {
            icon="train"
          }
          if (vehicle == "bus" && /^(6|9[0-9]{2}[A-Z]?)$/.test(data1[i].routeid)) {
            nightbus = "_night";
          } else {
            nightbus = "";
          }
          res.push({
            attime: data1[i].attime,
            predicted_attime: data1[i].predicted_attime,
            bikes: bikes,
            headsign: data1[i].headsign,
            inmin: data1[i].in,
            icon: icon,
            key: data1[i].routeid,
            station: station,
            vehicle: vehicle,
            wheelchair: wheelchair,
            nightbus: nightbus,
          });
        }
      } else {
        res.push({
          key: 'No service',
          vehicle: '',
          inmin: 'following',
          headsign: 'any destination',
          nightbus: '',
          wheelchair: '',
          bikes: '',
          icon: '',
          attime: '',
          predicted_attime: '',
          station: station
        });
      }
    }
    return res;
  }

  setConfig(config) {
    if (!config.entity) {
      throw new Error('Please define an entity');
    }
    config.filter

    const root = this.shadowRoot;
    if (root.lastChild) root.removeChild(root.lastChild);

    const cardConfig = Object.assign({}, config);
    const card = document.createElement('ha-card');
    const content = document.createElement('div');
    const style = document.createElement('style');
    style.textContent = `
      table {
        width: 100%;
        padding: 0px 36px 16px 0px;
        border: none;
        margin-left: 16px;
        margin-right: 16px;
      }
      table tr:nth-child(odd) {
        background-color: var(--paper-card-background-color);
        vertical-align: middle;
      }
      table tr:nth-child(even) td:not(.bpgo) {
        background-color: var(--secondary-background-color);
      }
      td {
        padding-left: 5px;
      }
      .highlight {
        font-weight: bold;
        font-size: 150%;
        width: 2em;
      }
      .vehicle {
        text-align: center;
        padding: 3px 10px 3px 10px;
        border-radius: 3px;
        color: #ffffff;
      }
      .emp {
        font-weight: bold;
        font-size: 120%;
      }
      .extraic {
        width: 1em;
        padding-left: 5px;
      }
      .bus {
        color: #44739e;
        width: 0.1em;
      }
      .bus_bpgo {
        background-color: #009FE3;
      }
      .bus_bpgo_night {
        background-color: #000000;
      }
      .trolleybus {
        color: #cc0000;
        width: 1.5em;
      }
      .trolleybus_bpgo {
        background-color: #E5231B;
      }
      .tram {
        color: #e1e100;
        width: 1.5em;
      }
      .tram_bpgo {
        background-color: #FFD500;
      }
      .rail {
        color: #2ecc71;
        width: 1.5em;
      }
      .rail_bpgo {
        background-color: #2ECC71;
      }
      .subway {
        width: 1.5em;
      }
      .arrival-time {
        text-align: right;
      }
      .estimated {
        color: #208C4E;
      }
      .h_station {
        padding-left: 5em;
        padding-bottom: 15px;
        display: inline-block;
        float: left;
      }
      .refresh {
        display: inline-block;
        margin-left: auto;
        margin-right: 20px;
        margin-top: -5px;
        float: right;
        background-color: #e0e0e0;
        padding: 4px;
        border-radius: 20%;
        color: var(--paper-item-icon-color);
    `;
    content.innerHTML = `
      <p id='station'>
      <table>
        <tbody id='attributes'>
        </tbody>
      </table>
    `;
    card.appendChild(style);
    card.appendChild(content);
    root.appendChild(card)
    this._config = cardConfig;
  }

  _updateContent(element, attributes, h_in_mins, h_at_time, h_predicted_at_time, l_bpgo) {
    if (l_bpgo) { /// BP GO layout
      element.innerHTML = `
        ${attributes.map((attribute) => `
          <tr>
            <td class="highlight vehicle bpgo ${attribute.vehicle}_bpgo${attribute.nightbus}">${attribute.key}</td>
            <td class="bpgo">${attribute.headsign}</td>
            <td class="highlight arrival-time bpgo ${attribute.predicted_attime ? "estimated" : ''}">${attribute.inmin}'</td>
          </tr>
        `).join('')}
      `;
    } else { /// original layout
      element.innerHTML = `
        ${attributes.map((attribute) => `
          <tr>
            <td class="${attribute.vehicle}"><ha-icon class="${attribute.vehicle}" icon="mdi:${attribute.icon}"></td>
            <td><span class="emp">${attribute.key}</span> to ${attribute.headsign}
            ${h_in_mins === false ? "in " + `${attribute.inmin}` + " mins" : ''}
            ${h_at_time === false ? "at " + `${attribute.attime}` : ''}
            ${h_predicted_at_time === false ? `${attribute.predicted_attime ? "at " + `${attribute.predicted_attime}` + "(est.)" : "at " + `${attribute.attime}`}`: '' }
            ${attribute.wheelchair}${attribute.bikes}</td>
          </tr>
        `).join('')}
      `;
    }
  }

  _updateStation(element, attributes, name) {
    element.innerHTML = `
      ${attributes.map((attribute) => `
        <div class="h_station emp">${name.length === 0 ? `${attribute.station}` : name}</div>
        <div class="refresh"><ha-icon icon="mdi:sync" id="b_refresh">
      `)[0]}
    `;
    this._root.getElementById('b_refresh').addEventListener('click', this._refresh.bind(this));
  }

  set hass(hass) {
    const config = this._config;
    this._root = this.shadowRoot;
    let hide_predicted_at_time = false;
    if (typeof config.hide_predicted_at_time != "undefined") hide_predicted_at_time=config.hide_predicted_at_time
    let hide_in_mins = false;
    if (typeof config.hide_in_mins != "undefined") hide_in_mins=config.hide_in_mins
    let hide_at_time = true;
    if (typeof config.hide_at_time != "undefined") hide_at_time=config.hide_at_time
    let name = '';
    if (typeof config.name != "undefined") name=config.name
    let max_items = 0;
    if (typeof config.max_items != "undefined") max_items=config.max_items
    let layout_bpgo = false;
    if (typeof config.layout_bpgo != "undefined") layout_bpgo=config.layout_bpgo

    let attributes = this._getAttributes(hass, config.entity);
    this._hass = hass;

    this._updateStation(this._root.getElementById('station'), attributes, name);
    this._updateContent(this._root.getElementById('attributes'), attributes, hide_in_mins, hide_at_time, hide_predicted_at_time, layout_bpgo);
  }

  _refresh() {
    this._hass.callService('bkk_stop', 'refresh', { entity_id: this._config.entity });
  }

  getCardSize() {
    return 1;
  }
}

customElements.define('bkk-stop-card', BKKStopCard);
