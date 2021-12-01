class BKKStopCard extends HTMLElement {

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  _getAttributes(hass,entity) {
    var res = [];
    var bikes = "";
    var icon;
    var vehicle;
    var wheelchair = "";

    if (typeof hass.states[`${entity}`] != "undefined") {
      const data1 = hass.states[`${entity}`].attributes['vehicles'];
      const station = hass.states[`${entity}`].attributes['stationName'];

      if (data1.length > 0) {
        for(var i=0; i<data1.length; i++) {
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
          res.push({
            attime: data1[i].attime,
            bikes: bikes,
            headsign: data1[i].headsign,
            inmin: data1[i].in,
            icon: icon,
            key: data1[i].routeid,
            station: station,
            vehicle: vehicle,
            wheelchair: wheelchair,
          });
        }
      } else {
        res.push({
          key: 'No service',
          vehicle: '',
          inmin: 'following',
          headsign: 'any destination',
          wheelchair: '',
          bikes: '',
          icon: '',
          attime: '',
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
      h3 {
        text-align: center;
        padding-top:15px;
      }
      table {
        width: 100%;
        padding: 0px 36px 16px 0px;
        border: none;
        margin-left: 16px;
        margin-right: 16px;
      }
      thead th {
        text-align: left;
      }
      tbody tr:nth-child(odd) {
        background-color: var(--paper-card-background-color);
        vertical-align: middle;
      }
      tbody tr:nth-child(even) {
        background-color: var(--secondary-background-color);
      }
      td {
        padding-left: 5px;
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
      .trolleybus {
         color: #cc0000;
         width: 1.5em;
      }
      .tram {
         color: #e1e100;
         width: 1.5em;
      }
      .rail {
         color: #2ecc71;
         width: 1.5em;
      }
      .subway {
         width: 1.5em;
      }
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

  _updateContent(element, attributes, h_in_mins, h_at_time) {
    element.innerHTML = `
      ${attributes.map((attribute) => `
        <tr>
          <td class="${attribute.vehicle}"><ha-icon icon="mdi:${attribute.icon}"></td>
          <td><span class="emp">${attribute.key}</span> to ${attribute.headsign}
          ${h_in_mins === false ? "in " + `${attribute.inmin}` + " mins"  : ''}
          ${h_at_time === false ? "at " + `${attribute.attime}` : ''}
          ${attribute.wheelchair}${attribute.bikes}</td>
        </tr>
      `).join('')}
    `;
  }

  _updateStation(element, attributes, name) {
    element.innerHTML = `
      ${attributes.map((attribute) => `
        <h3>${name.length === 0 ? `${attribute.station}` : name}</h3>
      `)[0]}
    `;
  }

  set hass(hass) {
    const config = this._config;
    const root = this.shadowRoot;

    let hide_in_mins = false;
    if (typeof config.hide_in_mins != "undefined") hide_in_mins=config.hide_in_mins
    let hide_at_time = true;
    if (typeof config.hide_at_time != "undefined") hide_at_time=config.hide_at_time
    let name = '';
    if (typeof config.name != "undefined") name=config.name

    let attributes = this._getAttributes(hass, config.entity);

    this._updateStation(root.getElementById('station'), attributes, name);
    this._updateContent(root.getElementById('attributes'), attributes, hide_in_mins, hide_at_time);
  }

  getCardSize() {
    return 1;
  }
}

customElements.define('bkk-stop-card', BKKStopCard);
