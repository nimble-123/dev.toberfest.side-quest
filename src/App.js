import {
  Avatar,
  Badge,
  Button,
  Card,
  CardHeader,
  Form,
  FormItem,
  Input,
  Icon,
  FlexBox,
  FlexBoxJustifyContent,
  FlexBoxWrap,
  ShellBar,
  Text,
  ThemeProvider,
} from '@ui5/webcomponents-react';

import '@ui5/webcomponents-icons/dist/AllIcons';
import '@ui5/webcomponents-icons/dist/reset';

import { spacing } from '@ui5/webcomponents-react-base';

import React, { useState } from 'react';
import axios from 'axios';

import './App.css';

const BASE_URL = 'https://people-api.services.sap.com';

const getDevtoberfestBadges = async (scnId) => {
  try {
    const response = await axios.get(`${BASE_URL}/rs/badge/${scnId}?size=1000`);

    const badges = response.data.content.filter((badge) => badge.displayName.includes('Devtoberfest 2021'));

    const enrichedBadges = badges.map((badge) => ({
      ...badge,
      displayNameCleansed: badge.displayName.includes('Participant')
        ? badge.displayName
        : badge.displayName.slice(29, -1),
      devtoberfestColor: badge.displayName.includes('Participant') ? 'c0ffee' : badge.displayName.slice(1, 7),
      descriptionCleansed: badge.description.replace(/(<([^>]+)>)/gi, ''),
      tutorialUrl: badge.displayName.includes('Participant')
        ? 'https://github.com/SAP-samples/devtoberfest-2021'
        : [...badge.description.matchAll(/<a\s+(?:[^>]*?\s+)?href=(["'])(.*?)\1/g)][1],
    }));

    console.log(`GET: Here's the list of badges`, enrichedBadges);

    return enrichedBadges;
  } catch (errors) {
    console.error(errors);
  }
};

function App() {
  const [inputProvided, setInputProvided] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [badges, setBadges] = useState([]);

  const handleGetBadgesPress = async () => {
    setBadges(await getDevtoberfestBadges(inputValue));
    setInputProvided(true);
  };

  const handleResetPress = async () => {
    setInputValue('');
    setBadges([]);
    setInputProvided(false);
  };

  const handleInputValueChange = async (event) => {
    setInputValue(await event.target.getInputValue());
  };

  const handleCardHeaderClick = async () => {};

  return (
    <ThemeProvider>
      <ShellBar
        logo={<img src="./Devtoberfest-Logo.png" alt="Logo" />}
        profile={
          <Avatar>
            <img src="./UI5-Logo.png" alt="Profile" />
          </Avatar>
        }
        primaryTitle="Devtoberfest 2021"
      />
      <FlexBox justifyContent={FlexBoxJustifyContent.Center} wrap={FlexBoxWrap.Wrap}>
        <img src="./Devtoberfest-Logo.png" alt="Logo" height="300px" />
      </FlexBox>
      <FlexBox
        justifyContent={FlexBoxJustifyContent.Center}
        wrap={FlexBoxWrap.Wrap}
        style={spacing.sapUiContentPadding}
      >
        {!inputProvided ? (
          <Form titleText="Tell me who you are..." style={spacing.sapUiContentPadding}>
            <FormItem label="SAP Community Profile">
              <Input value={inputValue} onChange={handleInputValueChange} style={spacing.sapUiSmallMarginEnd} />
              <Button icon="employee" onClick={handleGetBadgesPress}>
                Get Badges
              </Button>
            </FormItem>
          </Form>
        ) : (
          <Button icon={<Icon name="reset" />} onClick={handleResetPress} style={spacing.sapUiLargeMargin}>
            Reset
          </Button>
        )}
      </FlexBox>

      <FlexBox
        justifyContent={FlexBoxJustifyContent.Center}
        wrap={FlexBoxWrap.Wrap}
        style={spacing.sapUiContentPadding}
      >
        {inputProvided &&
          badges.map((badge) => {
            return (
              <Card
                key={badge.displayName}
                header={
                  <CardHeader
                    avatar={
                      <Avatar size="M">
                        <img src={badge.imageUrl} alt="Logo" />
                      </Avatar>
                    }
                    titleText={badge.displayNameCleansed}
                    style={{
                      backgroundColor: `#${badge.devtoberfestColor}`,
                    }}
                    interactive
                    onClick={handleCardHeaderClick}
                  />
                }
                style={{
                  maxWidth: '300px',
                  backgroundColor: `#${badge.devtoberfestColor}`,
                  ...spacing.sapUiContentPadding,
                }}
              >
                <FlexBox justifyContent={FlexBoxJustifyContent.Center} wrap={FlexBoxWrap.Wrap}>
                  <Badge
                    icon={<Icon name="competitor" />}
                    style={{
                      ...spacing.sapUiSmallMarginTop,
                    }}
                    colorScheme={Math.floor(Math.random() * 10) + 1}
                  >
                    #{badge.devtoberfestColor}
                  </Badge>
                  <Text style={spacing.sapUiContentPadding}>{badge.descriptionCleansed}</Text>
                </FlexBox>
              </Card>
            );
          })}
      </FlexBox>
    </ThemeProvider>
  );
}

export default App;
