# Lovelace custom card for BKK Stop Information Home Assistant custom component

This Lovelace custom card shows Budapest Public Transportation (BKK)
line information departing in the near future from a configurable stop.<p>
This custom card depends on the BKK Stop Information custom component that you may find at
[https://github.com/amaximus/bkk_stop](https://github.com/amaximus/bkk_stop/).

Lovelace UI does not support platform attributes natively.<br />
Inspired by [entity-attributes-card](https://github.com/custom-cards/entity-attributes-card)
on handling attributes in Lovelace, a Lovelace custom card was a dept and now made available for BKK Stop.

#### Installation
The easiest way to install it is through [HACS (Home Assistant Community Store)](https://custom-components.github.io/hacs/),
search for <i>bkk</i> and select the one from Plugins.<br />
If you are not using HACS, you may download bkk-stop-card.js and put it into $homeassistant_config_dir/www.<br />

#### Lovelace UI configuration
Add the following lines to your ui-lovelace.yaml (entity should be the sensor of bkk_stop platform you defined):
```
resources:
  - {type: module, url: '/www/community/bkk-stop-card/bkk-stop-card.js'}

    cards:
      - type: custom:bkk-stop-card
        entity: sensor.bkk7u
      - type: custom:bkk-stop-card
        entity: sensor.bkkxu
```

Lovelace UI:<br />
![bkk_stop Lovelace example](bkk_lovelace.jpg)
