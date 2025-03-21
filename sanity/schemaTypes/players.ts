import {defineType, defineField} from 'sanity'

export default defineType({
  name: 'player',
  title: 'Players',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Name',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'attended',
      title: 'Matches Attended',
      type: 'number',
      validation: (Rule) => Rule.min(0),
    }),
    defineField({
      name: 'win',
      title: 'Wins',
      type: 'number',
      validation: (Rule) => Rule.min(0),
    }),
    defineField({
      name: 'loss',
      title: 'Losses',
      type: 'number',
      validation: (Rule) => Rule.min(0),
    }),
    defineField({
      name: 'draw',
      title: 'Draws',
      type: 'number',
      validation: (Rule) => Rule.min(0),
    }),
    defineField({
      name: 'motm',
      title: 'Man of the Match Awards',
      type: 'number',
      validation: (Rule) => Rule.min(0),
    }),
    defineField({
      name: 'gotm',
      title: 'Goal of the Match Awards',
      type: 'number',
      validation: (Rule) => Rule.min(0),
    }),
  ],
})
