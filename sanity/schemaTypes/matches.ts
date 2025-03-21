import {defineType, defineField} from 'sanity'

export default defineType({
  name: 'match',
  title: 'Matches',
  type: 'document',
  fields: [
    defineField({
      name: 'date',
      title: 'Match Date',
      type: 'datetime',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'teamA',
      title: 'Team A',
      type: 'array',
      of: [{type: 'reference', to: [{type: 'player'}]}],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'teamB',
      title: 'Team B',
      type: 'array',
      of: [{type: 'reference', to: [{type: 'player'}]}],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'winner',
      title: 'Winner',
      type: 'string',
      options: {
        list: [
          {title: 'Team A', value: 'teamA'},
          {title: 'Team B', value: 'teamB'},
          {title: 'Draw', value: 'draw'},
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'potm',
      title: 'Player of the Match',
      type: 'reference',
      to: [{type: 'player'}],
    }),
    defineField({
      name: 'gotm',
      title: 'Goal of the Match',
      type: 'reference',
      to: [{type: 'player'}],
    }),
    defineField({
      name: 'teamAScore',
      title: 'Team A Score',
      type: 'number',
      validation: (Rule) => Rule.min(0).required(),
    }),
    defineField({
      name: 'teamBScore',
      title: 'Team B Score',
      type: 'number',
      validation: (Rule) => Rule.min(0).required(),
    }),
  ],
})
