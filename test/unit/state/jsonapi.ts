import { expect } from 'chai';
import { factory } from '../../../src/state/jsonapi';
import { JsonApiState } from '../../../src';

describe('JsonApi representor', () => {

  it('should parse objects without links' , async () => {

    const r = await callFactory({"foo": "bar"});
    expect(r.body).to.eql({foo: 'bar'});
    expect(r.links.getAll().length).to.equal(0);

  });

  it('should parse simple string links' , async () => {

    const input = {
      links: {
        example: 'https://example.org',
      },
      data: {
        type: 'foo',
        id: 'bar',
      },
    };
    const r = await callFactory(input);
    expect(r.links.getAll()).to.eql([
      {
        context: '/foo.json',
        href: 'https://example.org',
        rel: 'example',
      }
    ]);

  });

  it('should parse arrays of string links' , async () => {

    const input = {
      links: {
        example: [
          'https://example.org',
          'https://example.com',
        ]
      },
      data: {
        type: 'foo',
        id: 'bar',
      },
    };
    const r = await callFactory(input);
    expect(r.links.getAll()).to.eql([
      {
        context: '/foo.json',
        href: 'https://example.org',
        rel: 'example',
      },
      {
        context: '/foo.json',
        href: 'https://example.com',
        rel: 'example',
      }
    ]);

  });

  it('should parse object links' , async() => {

    const input = {
      links: {
        example: {
          href: 'https://example.org'
        },
      },
      data: {
        type: 'foo',
        id: 'bar',
      },
    };
    const r = await callFactory(input);
    expect(r.links.getAll()).to.eql([
      {
        context: '/foo.json',
        href: 'https://example.org',
        rel: 'example',
      }
    ]);

  });

  it('should parse arrays of object links' , async() => {

    const input = {
      links: {
        example: [
          { href: 'https://example.org' },
          { href: 'https://example.com' },
        ]
      },
      data: {
        type: 'foo',
        id: 'bar',
      },
    };
    const r = await callFactory(input);
    expect(r.links.getAll()).to.eql([
      {
        context: '/foo.json',
        href: 'https://example.org',
        rel: 'example',
      },
      {
        context: '/foo.json',
        href: 'https://example.com',
        rel: 'example',
      }
    ]);

  });

});

function callFactory(body: any): Promise<JsonApiState> {

  const response = new Response(JSON.stringify(body));
  return factory('/foo.json', response);

}
