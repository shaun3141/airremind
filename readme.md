# Reminders
Click to watch the demo (opens in Youtube)
[
![Reminders Demo](https://i.imgur.com/B0xDafy.jpg)
](https://www.youtube.com/watch?v=9aSfwC8eI08)

## About this Project

Airtable has kicked off a [$100,000 contest to highlight Airtable Blocks](https://airtable.devpost.com/), customizable apps that live in your tables. Custom Blocks are built with Javascript and React so you truly have full control over the app experience.

## Reminders Motivation

When I was running my business on Airtable, things moved fast and asynchronous communication was the default. I'd have to compose an email of what I had questions about or wanted to follow up with for each row in the spreadsheet, and then people would need to log in to Airtable, find the record, and make their update. I knew there had to be a better way.

## How it Works

The Reminders Block has two parts, 

**1)** The Airtable Block itself, that controls the UX and handles all of the business logic.

**2)** A bare-bones server that handles POST requests from the block and sends out Reminder emails.

## Features
- Automatically adopts to the current the table / view being used

- Automatically picks reasonable fields for reminders (i.e. first user field is the Owner, first Date field is the Due Date) - Easy to customize settings just in case.

 - Allows custom reminder message to be sent with the record seamlessly.

 - Gracefully catches when no owner is assigned and displays a prompt to the user.

 - Dynamically sized "flex" components support a variety of viewports, we use Airtable's `ViewportConstraint` to gracefully enforce a min size.

 - Elegantly hides empty records so the app stays clean

## Block Breakdown

### Initialization
The block starts in `index.js` 

In many of the block examples Airtable had, the user is asked to select the Table and View they'd like the app to run for. I started this way, but then realized I could just get the view the user was looking at automatically from the [`Cursor`](https://airtable.com/developers/blocks/api/models/Cursor) object Airtable provides, no more user selection needed.

```
useWatchable(cursor, ['activeTableId', 'activeViewId']);
```

To manage the Block state across users of my base, I leverage the [`Global Config`](https://airtable.com/developers/blocks/api/models/GlobalConfig) object heavily, each view has it's own configuration of fields and properties.

<img src="https://i.imgur.com/D3sMI8S.png" width=350>

In `index.js`, we render the Settings Toggle, Settings Block, and a Reminder for each non-empty record.

### Settings

<img src="https://i.imgur.com/RDaZZjN.png" width=350>

When the Reminders block is initialized for the very first time on a view, it tries to look at the fields available and pick reasonable defaults.

I accomplish this by having a list of acceptable [Field Types](https://airtable.com/developers/blocks/api/FieldType) per setting, for example:
```
const allowedOwnerTypes = [
  FieldType.EMAIL,
  FieldType.SINGLE_COLLABORATOR,
  FieldType.MULTIPLE_COLLABORATORS
];
```
```
const defaultOwnerFields = table.fields.filter((f) =>
  allowedOwnerTypes.includes(f.type)
);

if (defaultOwnerFields.length) {
  globalConfig.setAsync(
    [cursor.activeViewId, 'ownerField'],
    defaultOwnerFields[0].id
  );
}
```

This only runs once on view initialization. 

After that, users can select a different field or "None" for the optional field types like Due Date. I use Airtable's [`FieldPickerSynced`](https://airtable.com/developers/blocks/api/UI/components/FieldPickerSynced) to manage the field selection.

### Reminders

<img src="https://i.imgur.com/DT0lAf6.png" width=350>

Each Reminder is comprised of up to 4 fields:
 - **Subject** Field that shows up in Bold in the top-left.
 - **Owner** Field below the Subject showing who the owner is
 - **Details** Field, Optional, provides context about the Subject
 - **Due Date** Field, displayed as "Due X days ago / today / from now"

On each Reminder, you can take two actions:

**1.** **Remind the Owner(s)** - this prompts the user to provide a message about the reminder before sending it off to the respective owners.

**2.** **Edit the Record** - this opens Airtable's "Record Detail" page so you can quickly make the changes needed.

Some notable parts of the Reminder component are:

 - For Records without an Owner, the "Remind" button is disabled and a tooltip is displayed prompting the user to first add an owner.

 - I use [`Moment.js`](https://momentjs.com/) to do a lot of the date parsing and display, both in the application as well as in the email that gets sent.

 - [Lee Robinson](leerob.io) designed a beautiful, native-looking prompt to ask users for a custom message and confirmation prior to a reminder being sent.

<img src="https://i.imgur.com/KqKSzXZ.png" width=350>


### Sending the Reminder
To actually send the reminder, I created a bare-bones server to handle accepting the request and sending the email via Sendgrid (check out the [server](https://github.com/shaun3141/reminders_server) for more details) 

To get all the context needed, I had to pull from a few different places when constructing the payload:
```
const  payload  = {
  config:  config._kvStore,
  recordId:  record.id,
  viewId:  cursor.activeViewId,
  tableId:  cursor.activeTableId,
  record:  record._data.cellValuesByFieldId,
  dueDateMessage:  getDueDate(config, table, record),
  message,
  base:  _.pick(record._baseData, [
    'id',
    'name',
    'currentUserId',
    'collaboratorsById'
  ])
};
```
This was one of the trickier parts as the `config._kvStore` and `record._baseData` weren't documented well. 

## All in all

I had so much fun on this project. It was my first time really using React and I found Airtable's documentation and examples to be really helpful.

I'm very grateful that I could leverage [Lee Robinson](https://leerob.io/)'s intimate knowledge of React and UX to bring a lot of polish and professionalism to the Reminders block as well.
