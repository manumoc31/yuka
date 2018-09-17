/**
 * @author Mugen87 / https://github.com/Mugen87
 */

const expect = require( 'chai' ).expect;
const YUKA = require( '../../../build/yuka.js' );

const CellSpacePartitioning = YUKA.CellSpacePartitioning;
const GameEntity = YUKA.GameEntity;
const Vector3 = YUKA.Vector3;

const height = 10;
const width = 10;
const depth = 10;

const cellsX = 5;
const cellsY = 5;
const cellsZ = 5;

describe( 'CellSpacePartitioning', function () {

	describe( '#constructor()', function () {

		it( 'should partition the 3D space according to the given parameters', function () {

			const spatialIndex = new CellSpacePartitioning( height, width, depth, cellsX, cellsY, cellsZ );

			expect( spatialIndex.cells ).to.have.lengthOf( ( cellsX * cellsY * cellsZ ) );

		} );

	} );

	describe( '#addEntityToPartition()', function () {

		it( 'should add the given entity to the partition defined by the given index', function () {

			const spatialIndex = new CellSpacePartitioning( height, width, depth, cellsX, cellsY, cellsZ );

			const entity = new GameEntity();
			const index = 1;
			spatialIndex.addEntityToPartition( entity, index );

			expect( spatialIndex.cells[ index ].entities.has( entity ) ).to.be.true;

		} );

	} );

	describe( '#removeEntityToPartition()', function () {

		it( 'should remove the given entity from the partition defined by the given index', function () {

			const spatialIndex = new CellSpacePartitioning( height, width, depth, cellsX, cellsY, cellsZ );

			const entity = new GameEntity();
			const index = 1;
			spatialIndex.addEntityToPartition( entity, index );
			spatialIndex.removeEntityFromPartition( entity, index );

			expect( spatialIndex.cells[ index ].entities.has( entity ) ).to.be.false;

		} );

	} );

	describe( '#getIndexForPosition()', function () {

		it( 'should return the cell index for the given position', function () {

			const spatialIndex = new CellSpacePartitioning( height, width, depth, cellsX, cellsY, cellsZ );

			// the value range of a cell is [ i, i + cellSize )
			// in this example the cells have a value range of [ - 5, - 3 ) so - 3 belongs to the next cell

			const position1 = new Vector3( - 5, - 5, - 5 ); // select first cell for all axes
			const position2 = new Vector3( - 3, - 3.1, - 3.1 ); // select second cell for x-axis
			const position3 = new Vector3( - 3, - 3, - 3.1 ); // select second cell for x- and y-axis
			const position4 = new Vector3( - 3, - 3, - 3 ); // select second cell for all axes
			const position5 = new Vector3( 5, 5, 5 );

			expect( spatialIndex.getIndexForPosition( position1 ) ).to.equal( 0 );
			expect( spatialIndex.getIndexForPosition( position2 ) ).to.equal( 25 );
			expect( spatialIndex.getIndexForPosition( position3 ) ).to.equal( 30 );
			expect( spatialIndex.getIndexForPosition( position4 ) ).to.equal( 31 );
			expect( spatialIndex.getIndexForPosition( position5 ) ).to.equal( 124 );

		} );

		it( 'should clamp the index if the position is outside of the partition', function () {

			const spatialIndex = new CellSpacePartitioning( height, width, depth, cellsX, cellsY, cellsZ );

			const position1 = new Vector3( - 6, - 6, - 6 );
			const position2 = new Vector3( 6, 6, 6 );

			expect( spatialIndex.getIndexForPosition( position1 ) ).to.equal( 0 );
			expect( spatialIndex.getIndexForPosition( position2 ) ).to.equal( 124 );

		} );

	} );

	describe( '#updateEntity()', function () {

		it( 'should update the given entity by assigning the correct parition', function () {

			const spatialIndex = new CellSpacePartitioning( height, width, depth, cellsX, cellsY, cellsZ );

			const entity = new GameEntity();
			let currentIndex;

			entity.position.set( - 5, - 5, - 5 );
			currentIndex = spatialIndex.updateEntity( entity );
			expect( currentIndex ).to.equal( 0 );

			entity.position.set( - 5, - 5, - 2.9 );
			currentIndex = spatialIndex.updateEntity( entity, currentIndex );
			expect( currentIndex ).to.equal( 1 );

			currentIndex = spatialIndex.updateEntity( entity, currentIndex );
			expect( currentIndex ).to.equal( 1 );

		} );

	} );

	describe( '#query()', function () {

		it( 'should perform a query based on the given parameters and store the result in the given array', function () {

			const spatialIndex = new CellSpacePartitioning( height, width, depth, cellsX, cellsY, cellsZ );

			const entity1 = new GameEntity();
			const entity2 = new GameEntity();
			const entity3 = new GameEntity();
			const entity4 = new GameEntity();

			const result = [];
			const radius = 1;

			entity1.position.set( 0, 0, 0 );
			entity2.position.set( 0, 0, 0.5 );
			entity3.position.set( 0, 0, 1 );
			entity4.position.set( 0, 0, 3 );

			spatialIndex.updateEntity( entity1 );
			spatialIndex.updateEntity( entity2 );
			spatialIndex.updateEntity( entity3 );
			spatialIndex.updateEntity( entity4 );

			spatialIndex.query( entity1.position, radius, result );

			expect( result ).to.include( entity1 );
			expect( result ).to.include( entity2 );
			expect( result ).to.include( entity3 );
			expect( result ).to.not.include( entity4 );

		} );

	} );

} );