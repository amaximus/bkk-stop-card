[![hacs_badge](https://img.shields.io/badge/HACS-Default-orange.svg)](https://github.com/custom-components/hacs)

<p><a href="https://www.buymeacoffee.com/6rF5cQl" rel="nofollow" target="_blank"><img src="https://camo.githubusercontent.com/c070316e7fb193354999ef4c93df4bd8e21522fa/68747470733a2f2f696d672e736869656c64732e696f2f7374617469632f76312e7376673f6c6162656c3d4275792532306d6525323061253230636f66666565266d6573736167653d25463025394625413525413826636f6c6f723d626c61636b266c6f676f3d6275792532306d6525323061253230636f66666565266c6f676f436f6c6f723d7768697465266c6162656c436f6c6f723d366634653337" alt="Buy me a coffee" data-canonical-src="https://img.shields.io/static/v1.svg?label=Buy%20me%20a%20coffee&amp;message=%F0%9F%A5%A8&amp;color=black&amp;logo=buy%20me%20a%20coffee&amp;logoColor=white&amp;labelColor=b0c4de" style="max-width:100%;"></a></p>

# Lovelace custom card for BKK Stop Information

This Lovelace custom card displays Budapest Public Transportation (BKK)
line information departing in the near future from a configurable stop.<p>
This custom card depends on the BKK Stop Information custom component that you may find at
[https://github.com/amaximus/bkk_stop](https://github.com/amaximus/bkk_stop/).

Lovelace UI does not support platform attributes natively.<br />
Inspired by [entity-attributes-card](https://github.com/custom-cards/entity-attributes-card)
on handling attributes in Lovelace, a Lovelace custom card was a dept and now made available for BKK Stop.

#### Installation
The easiest way to install it is through [HACS (Home Assistant Community Store)](https://github.com/hacs/frontend),
search for <i>bkk</i> and select BKK Stop Card from Plugins.<br />
If you are not using HACS, you may download bkk-stop-card.js and put it into $homeassistant_config_dir/www.<br />

#### Lovelace UI configuration

Configuration parameters:<br />

---
| Name | Optional | `Default` | Description |
| :---- | :---- | :------- | :----------- |
| entity | **N** | - | name of the sensor of bkk_stop platform|
| hide_in_mins | **Y** | `false` | Hide in_minutes information|
| hide_at_time | **Y** | `true` | Hide at_time information|
| hide_predicted_at_time | **Y** | `true` | If set to false, this will show predicted times with an '(est.)' suffix, when estimated arrival times are available, otherwise it will show the time according to schedule |
| name | **Y** | `` | If specified it will overwrite the card title/station name |
---

For yaml mode Lovelace dashboard add the lines below to your ui-lovelace.yaml. For non-yaml dashboard use: overview → edit dashboard → 3 dot again → raw edit and add the card info there.
The entity should be the sensor of bkk_stop platform you defined.
```
resources:
  - {type: module, url: '/www/community/bkk-stop-card/bkk-stop-card.js'}

    cards:
      - type: custom:bkk-stop-card
        entity: sensor.bkk7u
        hide_in_mins: false # it makes sense to set this to false if hide_predicted_at_time is true, as in_mins is calculated from "scheduled" times
        hide_at_time: false 
        hide_predicted_at_time: true
      - type: custom:bkk-stop-card
        entity: sensor.bkkxu
        hide_in_mins: true
        hide_at_time: true
        hide_predicted_at_time: false

```

Lovelace UI:<br />
![bkk_stop Lovelace example](bkk_lovelace.jpg)
