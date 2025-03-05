export async function seed(knex) {
    await knex('books').del();
    
    await knex('books').insert([
        {
        title: 'The Great Gatsby',
        author: 'F. Scott Fitzgerald',
        description: 'The Great Gatsby is a novel by American author F. Scott Fitzgerald. The story takes place in 1922, during the Roaring Twenties, a time of prosperity in the United States after World War I. The book received critical acclaim and is generally considered Fitzgerald\'s best work. It is also widely regarded as a "Great American Novel" and a literary classic, capturing the essence of an era. The Modern Library named it the second best English-language novel of the 20th century.'
        },
        {
        title: 'To Kill a Mockingbird',
        author: 'Harper Lee',
        description: 'To Kill a Mockingbird is a novel by Harper Lee published in 1960. It was immediately successful, winning the Pulitzer Prize, and has become a classic of modern American literature. The plot and characters are loosely based on Lee\'s observations of her family, her neighbors and an event that occurred near her hometown of Monroeville, Alabama, in 1936, when she was 10.'
        },
        {
        title: '1984',
        author: 'George Orwell',
        description: '1984 is a dystopian social science fiction novel by English novelist George Orwell. It was published on 8 June 1949 by Secker & Warburg as Orwell\'s ninth and final book completed in his lifetime. Thematically, 1984 centres on the consequences of totalitarianism, mass surveillance, and repressive regimentation of persons and behaviours within society.'
        }
    ]);
}