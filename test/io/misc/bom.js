import test from 'tape'
import concat from 'concat-stream'
import {buffer as micromark} from '../../../lib/micromark/index.js'
import {stream} from '../../../lib/micromark/stream.js'
import {slowStream} from '../../util/slow-stream.js'

test('bom (byte order marker)', function (t) {
  t.equal(micromark('\uFEFF'), '', 'should ignore just a bom')

  t.equal(
    micromark('\uFEFF# hea\uFEFFding'),
    '<h1>hea\uFEFFding</h1>',
    'should ignore a bom'
  )

  t.equal(
    micromark(Buffer.from('\uFEFF')),
    '',
    'should ignore just a bom (buffer)'
  )

  t.equal(
    micromark(Buffer.from('\uFEFF# hea\uFEFFding')),
    '<h1>hea\uFEFFding</h1>',
    'should ignore a bom (buffer)'
  )

  t.test('should ignore a bom (stream)', function (t) {
    t.plan(1)

    slowStream('\uFEFF# hea\uFEFFding')
      .pipe(stream())
      .pipe(
        concat((result) => {
          t.equal(result, '<h1>hea\uFEFFding</h1>', 'pass')
        })
      )
  })

  t.test('should ignore just a bom (stream)', function (t) {
    t.plan(1)

    slowStream('\uFEFF')
      .pipe(stream())
      .pipe(
        concat((result) => {
          t.equal(result, '', 'pass')
        })
      )
  })

  t.end()
})
